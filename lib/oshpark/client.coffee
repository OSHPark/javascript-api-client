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
    .then (json)->
      @token = new Token(json)
      setTimeout (-> refreshToken.call(@)), @token.token - 5

class Client
  constructor: ({url, connection}={})->
    url ?= "https://oshpark.com/api/v1"
    connection ?= Oshpark.JQueryConnection
    @connection = new connection url
    refreshToken.call(@)

  hasToken: ->
    !!@token

  isAuthenticated: ->
    @token && !! @token.user()

  authenticate: (opts={})->
    new RSVP.Promise (resolve,reject)->
      refreshToken.call(@, opts)
        .then (token)->
          if token.user()?
            resolve token.user()
          else
            reject "Incorrect username or password"
        .fail (error)-> reject error

Oshpark.Client = Client
