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

resources = (resourcesName,klass)->
  getRequest.call @, resourcesName
  .then (data)-> new klass json for json in data[resourcesName]

argumentPromise = (id, resourceName)->
  new RSVP.Promise (resolve,reject)->
    reject(new Error "must provide an id for #{resourceName}") unless id?
    resolve(id)

resource = (resourceName,klass,id)->
  argumentPromise(id, resourceName)
  .then => getRequest.call @, "#{resourceName}s/#{id}"
  .then (data)-> new klass data[resourceName]

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
            if token.userId?
              resolve token.userId
            else
              reject "Incorrect username or password"
          .catch (error)-> reject error

  # Retrieve a list of the current user's projects.
  projects: ->
    resources.call @, 'projects', Oshpark.Project

  project: (id)->
    resource.call @, 'project', Oshpark.Project, id

  approveProject: (id)->
    argumentPromise(id, 'approveProject')
    .then => getRequest.call @, "projects/#{id}/approve"
    .then (data)-> new Oshpark.Project data['project']

  deleteProject: (id)->
    argumentPromise(id, 'deleteProject')
    .then => deleteRequest.call @, "projects/#{id}"
    .then -> true

  updateProject: (id, attrs={})->
    argumentPromise(id, 'updateProject')
    .then => putRequest.call @, "projects/#{id}", project: attrs
    .then (data)-> new Oshpark.Project data['project']

  orders: ->
    resources.call @, 'orders', Oshpark.Order

  order: (id)->
    resource.call @, 'order', Oshpark.Order, id

  cancelOrder: (id)->
    argumentPromise(id, 'cancelOrder')
    .then => deleteRequest.call @, "orders/#{id}"
    .then -> true

  updateOrder: (id, attrs={})->
    argumentPromise(id, 'updateOrder')
    .then => putRequest.call @, "orders/#{id}", order: attrs
    .then (data)-> new Oshpark.Order data['order']

  panels: ->
    resources.call @, 'panels', Oshpark.Panel

  panel: (id)->
    resource.call @, 'panel', Oshpark.Panel, id

  upload: (id)->
    resource.call @, 'upload', Oshpark.Upload, id

Oshpark.Client = Client
