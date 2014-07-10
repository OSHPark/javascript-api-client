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

computeApiKey = (email, secret)->
  source = "#{email}:#{secret}:#{@token.token}"
  hash   = new jsSHA(source, 'TEXT')
  hash.getHash('SHA-256', 'HEX')

class Oshpark.Client
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
        params.api_key = computeApiKey.call(@, email, opts.withApiSecret)

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

  # Retrieve a specific project from the user's collection by ID.
  project: (id)->
    resource.call @, 'project', Oshpark.Project, id

  # Approve a project if possible.
  approveProject: (id)->
    argumentPromise(id, 'approveProject')
    .then => getRequest.call @, "projects/#{id}/approve"
    .then (data)-> new Oshpark.Project data['project']

  # Remove a user's project
  deleteProject: (id)->
    argumentPromise(id, 'deleteProject')
    .then => deleteRequest.call @, "projects/#{id}"
    .then -> true

  # Update a project
  updateProject: (id, attrs={})->
    argumentPromise(id, 'updateProject')
    .then => putRequest.call @, "projects/#{id}", project: attrs
    .then (data)-> new Oshpark.Project data['project']

  # Retrieve all a user's orders.
  orders: ->
    resources.call @, 'orders', Oshpark.Order

  # Retrieve a specific order, by ID.
  order: (id)->
    resource.call @, 'order', Oshpark.Order, id

  # Cancel an order, if possible.
  cancelOrder: (id)->
    argumentPromise(id, 'cancelOrder')
    .then => deleteRequest.call @, "orders/#{id}"
    .then -> true

  # Update an order, if possible.
  updateOrder: (id, attrs={})->
    argumentPromise(id, 'updateOrder')
    .then => putRequest.call @, "orders/#{id}", order: attrs
    .then (data)-> new Oshpark.Order data['order']

  # Retrieve recent panels.
  panels: ->
    resources.call @, 'panels', Oshpark.Panel

  # Retrieve a specific panel.
  panel: (id)->
    resource.call @, 'panel', Oshpark.Panel, id

  # Retrieve a specific upload, by ID.
  upload: (id)->
    resource.call @, 'upload', Oshpark.Upload, id
