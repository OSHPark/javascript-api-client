ADDRESS = {
  name:               'James Harton',
  company_name:       'Resistor Ltd',
  address_line_1:     'Level One, 83-85 Victoria Road',
  address_line_2:     'Devonport',
  city:               'Auckland',
  zip_or_postal_code: '0624',
  country:            'nz'
}

cleanup = ->
  client = new Oshpark.Client url: '@@API_URL'
  client.authenticate '@@EMAIL', withApiSecret: '@@API_SECRET'
    .then ->
      client.projects().then (projects)->
        for project in projects
          client.destroyProject project.id

      client.orders().then (orders)->
        for order in orders
          client.cancelOrder order.id if order.isCancellable()

describe 'API Workflow', ->
  before ->
    @timeout 10000
    @client = new Oshpark.Client url: '@@API_URL'
    cleanup()

  after ->
    @timeout 10000
    cleanup()

  it 'authenticates', ->
    @timeout 10000
    expect @client.authenticate '@@EMAIL', withApiSecret: '@@API_SECRET'
      .to.be.fulfilled

  # We're not doing uploading at the moment because it's too damn hairy.
  it 'imports a design from a URL', ->
    @timeout 10000
    @client.createImport '@@FIXTURE_URL'
      .then (_import)=>
        expect(_import).to.be.an.instanceOf(Oshpark.Import)
        @importId = _import.id

  it 'processes the import', ->
    @timeout 360000
    @client.projectFromImport @importId
      .then (project)=>
        expect(project).to.be.an.instanceOf(Oshpark.Project)
        @projectId = project.id

  it 'has a valid project', ->
    @timeout 10000
    @client.project @projectId
      .then (project)=>
        expect(project.isNew()).to.be.true
        expect(project.topImage()).to.be.an.instanceOf(Oshpark.Image)
        expect(project.bottomImage()).to.be.an.instanceOf(Oshpark.Image)
        for layer in project.layers()
          expect(layer).to.be.an.instanceOf(Oshpark.Layer)

  it 'approves the project', ->
    @timeout 10000
    @client.approveProject @projectId
      .then (project)=>
        expect(project.isApproved()).to.be.true

  it 'creates an empty order', ->
    @timeout 10000
    @client.createOrder().then (order)=>
      expect(order).to.be.an.instanceOf(Oshpark.Order)
      expect(order.isEmpty()).to.be.true
      @orderId = order.id

  it 'adds the project to the order', ->
    @timeout 10000
    @client.addItemToOrder @orderId, @projectId, 3
      .then (order)=>
        expect(order.orderItems()).not.to.be.empty
        for item in order.orderItems()
          expect(item).to.be.an.instanceOf(Oshpark.OrderItem)

  it 'sets the order delivery address', ->
    @timeout 10000
    @client.setOrderAddress @orderId, ADDRESS
      .then (order)->
        expect(order.address()).to.be.an.instanceOf(Oshpark.Address)

  it 'retrieves the available shipping rates', ->
    @timeout 10000
    @client.shippingRates ADDRESS
      .then (rates)=>
        expect(rates).not.to.be.empty
        for rate in rates
          expect(rate).to.be.an.instanceOf(Oshpark.ShippingRate)

        @shippingRate = rates[0]

  it 'sets the order shipping rate', ->
    @timeout 10000
    @client.setOrderShippingRate @orderId, @shippingRate
      .then (order)->
        expect(order.shippingRate()).to.be.an.instanceOf(Oshpark.ShippingRate)

  it 'checks out the order', ->
    @timeout 10000
    @client.checkoutOrder @orderId
      .then (order)->
        expect(order.isReceived()).to.be.true
