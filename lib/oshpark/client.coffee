lastTimeoutId = null

postRequest = (endpoint, params)->
  @connection.request 'POST', endpoint, params, @token

putRequest = (endpoint, params)->
  @connection.request 'PUT', endpoint, params, @token

getRequest = (endpoint, params)->
  @connection.request 'GET', endpoint, params, @token

deleteRequest = (endpoint, params)->
  @connection.request 'DELETE', endpoint, params, @token

refreshToken = (params={})->
  postRequest.call @, 'sessions', params
    .then (json)=>
      @token = new Oshpark.Token(json['api_session_token'])
      ttl = @token.ttl - 10
      ttl = 10 if ttl < 10
      clearTimeout(lastTimeoutId) if lastTimeoutId?
      lastTimeoutId = setTimeout (=> refreshToken.call(@)), ttl * 1000

class Client
  constructor: ({url, connection}={})->
    url         ?= "https://oshpark.com/api/v1"
    connection  ?= Oshpark.JQueryConnection
    @connection = new connection url
    refreshToken.call(@)

  hasToken: ->
    !!@token

  isAuthenticated: ->
    @token && @token.user?

  authenticate: (opts={})->
    new RSVP.Promise (resolve,reject)=>
      refreshToken.call(@, opts)
        .then (token)->
          if token.user?
            resolve token.user
          else
            reject "Incorrect username or password"
        .fail (error)-> reject error

  projects: ->
    getRequest.call @, 'projects'
      .then (data)->
        new Oshpark.Project json for json in data['projects']

  project: (id)->
    getRequest.call @, "projects/#{id}"
      .then (data)->
        new Oshpark.Project data['project']

  orders: ->
    getRequest.call @, 'orders'
      .then (data)->
        new Oshpark.Order json for json in data['orders']

  order: (id)->
    getRequest.call @, "orders/#{id}"
      .then (data)->
        new Oshpark.Order data['order']

Oshpark.Client = Client
