lastTimeoutId = null

postRequest = (endpoint, params)->
  @connection.request 'POST', endpoint, params, @token

putRequest = (endpoint, params)->
  @connection.request 'PUT', endpoint, params, @token

getRequest = (endpoint, params)->
  @connection.request 'GET', endpoint, params, @token

deleteRequest = (endpoint, params)->
  @connection.request 'DELETE', endpoint, params, @token

reallyRequestToken = (params)->
  postRequest.call @, 'sessions', params
    .then (json)=>
      @token = new Oshpark.Token(json['api_session_token'])
      ttl = @token.ttl - 10
      ttl = 10 if ttl < 10
      clearTimeout(lastTimeoutId) if lastTimeoutId?
      lastTimeoutId = setTimeout (=> refreshToken.call(@)), ttl * 1000
      @token

refreshToken = (params={})->
  if @tokenPromise
    @tokenPromise.then => reallyRequestToken.call(@, params)
  else
    @tokenPromise = reallyRequestToken.call(@, params)

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

  # Authenticate with a given username and password, or api secret.
  #
  #     client.authenticate 'user@example.com', withPassword: 'myPassword'
  #
  #  or
  #
  #     client.authenticate 'user@example.com', withApiSecret: 'mySecret'
  #
  authenticate: (email, opts={})->
    @tokenPromise.then =>
      params = email: email
      if opts.withPassword?
        params.password = opts.withPassword
      else if opts.withApiSecret?
        params.api_key = (new jsSHA("#{email}:#{opts.withApiSecret}:#{@token.token}", 'TEXT')).getHash('SHA-256', 'HEX')

      new RSVP.Promise (resolve,reject)=>
        refreshToken.call(@, params)
          .then (token)->
            if token.user_id?
              resolve token.user_id
            else
              reject "Incorrect username or password"
          .catch (error)-> reject error

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
