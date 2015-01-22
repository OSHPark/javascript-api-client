`import JQueryConnection from 'oshpark/jquery_connection'`
`import Token from 'oshpark/token'`
`import Project from 'oshpark/project'`
`import Order from 'oshpark/order'`
`import ShippingRate from 'oshpark/shipping_rate'`
`import Panel from 'oshpark/panel'`
`import Upload from 'oshpark/upload'`
`import Import from 'oshpark/import'`

lastTimeoutId = null

attributes_of = (object)->
  if object.__attrs__?
    object.__attrs__
  else
    object

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
      @token = new Token(json['api_session_token'], @)
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

resources = (resourcesName,klass, jsonRoot=resourcesName)->
  getRequest.call @, resourcesName
    .then (data)=> new klass json, @ for json in data[jsonRoot]

createResource = (resourcesName, klass, params={}, jsonRoot=resourcesName)->
  postRequest.call @, resourcesName, params
    .then (data)=> new klass data[jsonRoot], @

argumentPromise = (id, resourceName, argName='id')->
  new RSVP.Promise (resolve,reject)->
    reject(new Error "must provide an #{argName} for #{resourceName}") unless id?
    resolve(id)

resource = (resourceName,klass,id,jsonRoot=resourceName)->
  argumentPromise(id, resourceName)
  .then => getRequest.call @, "#{resourceName}s/#{id}"
  .then (data)=> new klass data[jsonRoot], @

computeApiKey = (email, secret)->
  source = "#{email}:#{secret}:#{@token.token}"
  hash   = new jsSHA(source, 'TEXT')
  hash.getHash('SHA-256', 'HEX')

class Client
  constructor: ({url, connection}={})->
    url         ?= "https://oshpark.com/api/v1"
    connection  ?= JQueryConnection
    @connection = new connection url
    refreshToken.call(@)

  hasToken: ->
    !!@token

  isAuthenticated: ->
    @token && @token.user?

  # Authenticate with a given email address and password, or api secret.
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
      else
        return reject "Must provide a password or api secret"

      new RSVP.Promise (resolve,reject)=>
        refreshToken.call(@, params)
          .then (token)->
            if token.userId?
              resolve token.userId
            else
              reject "Incorrect email address or password"
          .catch (error)-> reject error

  # Retrieve a list of the current user's projects.
  projects: ->
    resources.call @, 'projects', Project

  # Retrieve a specific project from the user's collection by ID.
  project: (id)->
    resource.call @, 'project', Project, id

  # Approve a project if possible.
  approveProject: (id)->
    argumentPromise(id, 'approveProject')
    .then => getRequest.call @, "projects/#{id}/approve"
    .then (data)=> new Project data['project'], @

  # Remove a user's project
  deleteProject: (id)->
    argumentPromise(id, 'deleteProject')
    .then => deleteRequest.call @, "projects/#{id}"
    .then -> true

  # Update a project
  updateProject: (id, attrs={})->
    argumentPromise(id, 'updateProject')
    .then => putRequest.call @, "projects/#{id}", project: attrs
    .then (data)=> new Project data['project'], @

  sharedProjects: ->
    resources.call @, 'shared_projects', Project, 'projects'

  sharedProject: (id)->
    resource.call @, 'shared_project', Project, id, 'project'

  # Request a price estimate
  #
  # @param width    In thousandths of an Inch
  # @param height   In thousandths of an Inch
  # @param layers   Number of copper layers
  # @param quantity (Optional) defaults to the minimum quantity
  priceEstimate: (width, height, layers=2, quantity=3)->
    new RSVP.Promise (resolve, reject)=>
      return reject "Must provide a board height" unless height?
      return reject "Must provide a board width" unless width?
      postRequest.call @, 'pricing', {width_in_mils: width, height_in_mils: height, pcb_layers: layers, quantity: quantity }
        .then(resolve,reject)

  # Create a new order.
  createOrder: ->
    createResource.call @, 'orders', Order, {}, 'order'

  # Retrieve all a user's orders.
  orders: ->
    resources.call @, 'orders', Order

  # Retrieve a specific order, by ID.
  order: (id)->
    resource.call @, 'order', Order, id

  # Cancel an order, if possible.
  cancelOrder: (id)->
    argumentPromise(id, 'cancelOrder')
    .then => deleteRequest.call @, "orders/#{id}"
    .then -> true

  # Update an order, if possible.
  updateOrder: (id, attrs={})->
    argumentPromise(id, 'updateOrder')
    .then => putRequest.call @, "orders/#{id}", order: attrs
    .then (data)=> new Order data['order'], @

  # Add an item (at this time only a project) to the order.
  addItemToOrder: (id, projectId, quantity=3)->
    argumentPromise(id, 'addItemToOrder')
      .then => argumentPromise(projectId, 'addItemToOrder', 'projectId')
      .then =>
        postRequest.call @, "orders/#{id}/add_item", order:
          project_id: projectId
          quantity:   quantity
      .then (data)=>
        new Order data['order'], @

  # Set the delivery address for the order.
  setOrderAddress: (id, address)->
    argumentPromise(id, 'setOrderAddress').then =>
      argumentPromise(address, 'setOrderAddress', 'address').then =>
        postRequest.call @, "orders/#{id}/set_address", order: {address: attributes_of address }
          .then (data)=> new Order data['order'], @

  # Set the order to a specific shipping rate.
  setOrderShippingRate: (id, rate)->
    argumentPromise(id, 'setOrderShippingRate').then =>
      argumentPromise(rate, 'setOrderShippingRate', 'rate').then =>
        postRequest.call @, "orders/#{id}/set_shipping_rate", order: {shipping_rate: attributes_of rate }
          .then (data)=> new Order data['order'], @

  # Check out an order
  checkoutOrder: (id)->
    argumentPromise(id, 'checkoutOrder').then =>
      postRequest.call @, "orders/#{id}/checkout"
        .then (data)=> new Order data['order'], @

  # Retrieve the available shipping rates for a given address.
  shippingRates: (address)->
    argumentPromise(address, 'shippingRates', 'address').then =>
      postRequest.call @, "shipping_rates", address: attributes_of address
        .then (data)=>
          new ShippingRate json, @ for json in data['shipping_rates']


  # Retrieve recent panels.
  panels: ->
    resources.call @, 'panels', Panel

  # Retrieve a specific panel.
  panel: (id)->
    resource.call @, 'panel', Panel, id

  # Retrieve a specific upload, by ID.
  upload: (id)->
    resource.call @, 'upload', Upload, id

  # Retrieve a specific import, by ID.
  import: (id)->
    resource.call @, 'import', Import, id

  # Create an import from a URL.
  createImport: (url)->
    argumentPromise(url, 'createImport', 'url')
    .then =>
      postRequest.call @, 'imports', url: url
    .then (data)=> new Import data['import'], @

  # Wait for a given import to be finished and return the Project
  # created by it.
  projectFromImport: (id)->
    checkImport = (id,resolve,reject)=>
      @import id
        .then (_import)=>
          if _import.isProcessing()
            window.setTimeout (=> checkImport id, resolve, reject), 2000
          else if _import.isSuccessful()
            resolve @project(_import.projectId)
          else
            reject _import

    new RSVP.Promise (resolve,reject)=> checkImport id, resolve, reject

`export default Client`
