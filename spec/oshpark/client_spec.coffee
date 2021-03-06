describe 'Oshpark.Client', ->
  beforeEach ->
    @server = sinon.fakeServer.create()
    @server.lastRequest = =>
      @server.requests[@server.requests.length - 1]
    @jsonHeader  = {'Content-Type': 'application/json'}
    @client = new Oshpark.Client

  afterEach ->
    @server.restore()

  it 'exists', ->
    expect(Oshpark.Client).to.exist

  describe '#constructor', ->

    describe 'default arguments', ->

      it 'creates a JQueryConnection', ->
        expect(@client.connection).to.be.an.instanceof(Oshpark.JQueryConnection)

      it 'sets the URL to "https://oshpark.com/api/v1"', ->
        expect(@client.connection).to.haveOwnProperty('endpointUrl', "https://oshpark.com/api/v1")

    describe 'setting URL', ->

      beforeEach ->
        @client = new Oshpark.Client url: 'foo.com'

      it 'creates a JQueryConnection', ->
        expect(@client.connection).to.be.an.instanceof(Oshpark.JQueryConnection)

      it 'sets the URL', ->
        expect(@client.connection).to.haveOwnProperty('endpointUrl', "foo.com")

    describe 'setting the connection class', ->

      beforeEach ->
        @fakeConnection = class FakeConnection extends Oshpark.Connection
        @client = new Oshpark.Client connection: @fakeConnection

      it 'creates a connection', ->
        expect(@client.connection).to.be.an.instanceof(@fakeConnection)

      it 'sets the URL to "https://oshpark.com/api/v1"', ->
        expect(@client.connection).to.haveOwnProperty('endpointUrl', "https://oshpark.com/api/v1")

  describe '#authenticate', ->

    jsonBody    = '{"api_session_token":{"token":"abcd1234","ttl":1199,"user_id":"123"}}'
    lastRequest = null

    beforeEach ->
      @server.respondWith [201, @jsonHeader, jsonBody]
      @server.autoRespond = true
      @client = new Oshpark.Client

    afterEach ->
      @server.restore()

    describe 'when authenticating with a password', ->

      it 'refreshes the user\'s token with the email address and password', ->
        @client.authenticate 'user@example.com', withPassword: 'myPassword'
          .then =>
            expect(@server.lastRequest()).to.have.property('requestBody', 'email=user%40example.com&password=myPassword')

    describe 'when authenticating with an API secret', ->

      it 'refreshes the user\'s token with the email address and computed API key', ->
        @client.authenticate 'user@example.com', withApiSecret: 'mySecret'
          .then =>
            expect(@server.lastRequest()).to.have.property('requestBody', 'email=user%40example.com&api_key=5bce1d7d2cd70a8559157a78ec7ab018f533cc54b9cd5b8bbc05bc4be32fd2e4')

  ['project', 'order', 'panel'].forEach (resourceName)->
    resourcesName  = "#{resourceName}s"
    resourceKlass  = Oshpark[resourceName.charAt(0).toUpperCase() + resourceName.slice(1).toLowerCase()]

    describe "##{resourcesName}", ->
      jsonBody = "{\"#{resourcesName}\": [{ \"id\": \"abcdef\" }]}"

      beforeEach ->
        @server.respondWith [200, @jsonHeader, jsonBody]
        @server.autoRespond = true

      afterEach -> @server.restore()

      it 'is a promise', ->
        expect(@client[resourcesName]()).to.eventually.be.fulfilled

      it 'is to the correct URL', ->
        @client[resourcesName]().then =>
          expect(@server.lastRequest()).to.have.property('url', "https://oshpark.com/api/v1/#{resourcesName}")

      it 'is the correct HTTP method', ->
        @client[resourcesName]().then =>
          expect(@server.lastRequest()).to.have.property('method', 'GET')

      it "retrieves the #{resourcesName} from the API", ->
        @client[resourcesName]().then (resources)->
          resources.forEach (resource)->
            expect(resource).to.have.property('constructor', resourceKlass)
            expect(resource).to.have.property('id', 'abcdef')

    describe "##{resourceName}(:id)", ->
      jsonBody = "{\"#{resourceName}\": { \"id\": \"abc123\" } }"

      beforeEach ->
        @server.respondWith [200, @jsonHeader, jsonBody]
        @server.autoRespond = true

      afterEach -> @server.restore()

      it 'is a promise', ->
        expect(@client[resourceName]('abc123')).to.eventually.be.fulfilled

      it 'fails when not passed an id', ->
        expect(@client[resourceName]()).to.be.rejected

      it 'is to the correct URL', ->
        @client[resourceName]('abc123').then =>
          expect(@server.lastRequest()).to.have.property('url', "https://oshpark.com/api/v1/#{resourcesName}/abc123")

      it 'is the correct HTTP method', ->
        @client[resourceName]('abc123').then =>
          expect(@server.lastRequest()).to.have.property('method', 'GET')

      it "retrieves a specific #{resourceName} from the API", ->
        @client[resourceName]('abc123').then (resource)->
          expect(resource).to.have.property('constructor', resourceKlass)
          expect(resource).to.have.property('id', 'abc123')


  describe '#approveProject(:id)', ->

    beforeEach ->
      @server.respondWith [200, @jsonHeader, '{ "project": { "id": "abc123", "state": "APPROVED" } }']
      @server.autoRespond = true

    afterEach -> @server.restore()

    it 'is a promise', ->
      expect(@client.approveProject('abc123')).to.eventually.be.fulfilled

    it 'fails when not passed an id', ->
      expect(@client.approveProject()).to.be.rejected

    it 'is to the correct URL', ->
      @client.approveProject('abc123').then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/projects/abc123/approve')

    it 'is the correct HTTP method', ->
      @client.approveProject('abc123').then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')


    it 'resolves to the modified Project', ->
      @client.approveProject('abc123').then (project)->
        expect(project).to.have.property('constructor', Oshpark.Project)
        expect(project).to.have.property('id', 'abc123')
        expect(project).to.have.property('state', 'APPROVED')

  describe '#deleteProject(:id)', ->

    beforeEach ->
      @server.respondWith [201, @jsonHeader, '']
      @server.autoRespond = true

    afterEach -> @server.restore()

    it 'is a promise', ->
      expect(@client.deleteProject('abc123')).to.eventually.be.fulfilled

    it 'fails when not passed an id', ->
      expect(@client.deleteProject()).to.be.rejected

    it 'is to the correct URL', ->
      @client.deleteProject('abc123').then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/projects/abc123')

    it 'is the correct HTTP method', ->
      @client.deleteProject('abc123').then =>
        expect(@server.lastRequest()).to.have.property('method', 'DELETE')

    it 'resolves to true', ->
      @client.deleteProject('abc123').then (value)=>
        expect(value).to.equal(true)

  describe '#updateProject(:id, :attrs)', ->

    beforeEach ->
      @server.respondWith [200, @jsonHeader, '{ "project": { "id": "abc123" } }']
      @server.autoRespond = true

    afterEach -> @server.restore()

    it 'is a promise', ->
      expect(@client.updateProject('abc123', {})).to.eventually.be.fulfilled

    it 'fails when not passed an id', ->
      expect(@client.updateProject()).to.be.rejected

    it 'is to the correct URL', ->
      @client.updateProject('abc123', {}).then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/projects/abc123')

    it 'is the correct HTTP method', ->
      @client.updateProject('abc123', {}).then =>
        expect(@server.lastRequest()).to.have.property('method', 'PUT')

    it 'resolves to the modified Project', ->
      @client.updateProject('abc123').then (project)->
        expect(project).to.have.property('constructor', Oshpark.Project)
        expect(project).to.have.property('id', 'abc123')

  describe '#priceEstimate(:width, :height, :pcbLayers, :quantity)', ->
    beforeEach ->
      @server.respondWith [200, @jsonHeader, '{ "pricing": {
        "width_in_mils"  : 1000,
        "height_in_mils" : 1000,
        "pcb_layers"     : 2,
        "quantity"       : 3,
        "subtotal"       : 5
      } }']
      @server.autoRespond = true

    afterEach -> @server.restore()

    it 'is a promise', ->
      expect(@client.priceEstimate(1000,1000,2,3)).to.eventually.be.fulfilled

    it 'fails when not passed a width', ->
      expect(@client.priceEstimate(undefined, 1000, 2, 3)).to.be.rejected

    it 'fails when not passed a height', ->
      expect(@client.priceEstimate(1000, undefined, 2, 3)).to.be.rejected

    it 'is to the correct URL', ->
      @client.priceEstimate(1000, 1000, 2, 3).then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/pricing')

    it 'is the correct HTTP method', ->
      @client.priceEstimate(1000, 1000, 2, 3).then =>
        expect(@server.lastRequest()).to.have.property('method', 'POST')

    it 'resolves to the expected price', ->
      @client.priceEstimate(1000, 1000, 2, 3).then (price)=>
        expect(price).to.have.property('pricing')
        price = price['pricing']
        expect(price).to.have.property('width_in_mils', 1000)
        expect(price).to.have.property('height_in_mils', 1000)
        expect(price).to.have.property('pcb_layers', 2)
        expect(price).to.have.property('quantity', 3)
        expect(price).to.have.property('subtotal', 5)

  describe '#sharedProjects', ->

    beforeEach ->
      @server.respondWith [200, @jsonHeader, '{ "projects": [ { "id": "abc123" } ] }']
      @server.autoRespond = true

    afterEach -> @server.restore()

    it 'is a promise', ->
      expect(@client.sharedProjects()).to.eventually.be.fulfilled

    it 'is to the correct URL', ->
      @client.sharedProjects().then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/shared_projects')

    it 'is the correct HTTP method', ->
      @client.sharedProjects().then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')

    it 'retrieves the projects from the API', ->
      @client.sharedProjects().then (projects)->
        projects.forEach (project)->
          expect(project).to.have.property('constructor', Oshpark.Project)
          expect(project).to.have.property('id', 'abc123')

  describe '#sharedProject', ->
    beforeEach ->
      @server.respondWith [200, @jsonHeader, '{ "project": { "id": "abc123" } }']
      @server.autoRespond = true

    afterEach -> @server.restore()

    it 'is a promise', ->
      expect(@client.sharedProject('abc123')).to.eventually.be.fulfilled

    it 'is to the correct URL', ->
      @client.sharedProject('abc123').then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/shared_projects/abc123')

    it 'is the correct HTTP method', ->
      @client.sharedProject('abc123').then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')

    it 'retrieves a specific project from the API', ->
      @client.sharedProject('abc123').then (project)->
        expect(project).to.have.property('constructor', Oshpark.Project)
        expect(project).to.have.property('id', 'abc123')

  describe '#cancelOrder(:id)', ->

    beforeEach ->
      @server.respondWith [200, @jsonHeader, '']
      @server.autoRespond = true

    it 'is a promise', ->
      expect(@client.cancelOrder('abc123')).to.eventually.be.fulfilled

    it 'fails when not passed an id', ->
      expect(@client.cancelOrder()).to.be.rejected

    it 'is to the correct URL', ->
      @client.cancelOrder('abc123').then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/orders/abc123')

    it 'is the correct HTTP method', ->
      @client.cancelOrder('abc123').then =>
        expect(@server.lastRequest()).to.have.property('method', 'DELETE')

    it 'resolves to true', ->
      @client.cancelOrder('abc123').then (value)=>
        expect(value).to.equal(true)

  describe '#updateOrder(:id, :attrs)', ->

    beforeEach ->
      @server.respondWith [200, @jsonHeader, '{ "order": { "id": "abc123" } }']
      @server.autoRespond = true

    afterEach -> @server.restore()

    it 'is a promise', ->
      expect(@client.updateOrder('abc123', {})).to.eventually.be.fulfilled

    it 'fails when not passed an id', ->
      expect(@client.updateOrder()).to.be.rejected

    it 'is to the correct URL', ->
      @client.updateOrder('abc123', {}).then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/orders/abc123')

    it 'is the correct HTTP method', ->
      @client.updateOrder('abc123', {}).then =>
        expect(@server.lastRequest()).to.have.property('method', 'PUT')

    it 'resolves to the modified Order', ->
      @client.updateOrder('abc123').then (order)->
        expect(order).to.have.property('constructor', Oshpark.Order)
        expect(order).to.have.property('id', 'abc123')

  describe '#upload(:id)', ->
    jsonBody = '{"upload": { "id": "abc123" } }'

    beforeEach ->
      @server.respondWith [200, @jsonHeader, jsonBody]
      @server.autoRespond = true

    afterEach -> @server.restore()

    it 'is a promise', ->
      expect(@client.upload('abc123')).to.eventually.be.fulfilled

    it 'fails when not passed an id', ->
      expect(@client.upload()).to.be.rejected

    it 'is to the correct URL', ->
      @client.upload('abc123').then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/uploads/abc123')

    it 'is the correct HTTP method', ->
      @client.upload('abc123').then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')

    it "retrieves a specific upload from the API", ->
      @client.upload('abc123').then (resource)->
        expect(resource).to.have.property('constructor', Oshpark.Upload)
        expect(resource).to.have.property('id', 'abc123')

  describe '#import(:id)', ->
    jsonBody = '{"import": { "id": "abc123" } }'

    beforeEach ->
      @server.respondWith [200, @jsonHeader, jsonBody]
      @server.autoRespond = true

    afterEach -> @server.restore()

    it 'is a promise', ->
      expect(@client.import('abc123')).to.eventually.be.fulfilled

    it 'fails when not passed an id', ->
      expect(@client.import()).to.be.rejected

    it 'is to the correct URL', ->
      @client.import('abc123').then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/imports/abc123')

    it 'is the correct HTTP method', ->
      @client.import('abc123').then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')

    it "retrieves a specific import from the API", ->
      @client.import('abc123').then (resource)->
        expect(resource).to.have.property('constructor', Oshpark.Import)
        expect(resource).to.have.property('id', 'abc123')

  describe '#createImport(:url)', ->
    jsonBody = '{"import": { "original_url": "http://example.com/design.brd" } }'

    beforeEach ->
      @server.respondWith [201, @jsonHeader, jsonBody]
      @server.autoRespond = true

    afterEach -> @server.restore()

    it 'is a promise', ->
      expect(@client.createImport('http://example.com/design.brd')).to.eventually.be.fulfilled

    it 'fails when not passed a url', ->
      expect(@client.createImport()).to.be.rejected

    it 'is to the correct URL', ->
      @client.createImport('http://example.com/design.brd').then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/imports')

    it 'is the correct HTTP method', ->
      @client.createImport('http://example.com/design.brd').then =>
        expect(@server.lastRequest()).to.have.property('method', 'POST')

    it "retrieves a specific import from the API", ->
      @client.createImport('http://example.com/design.brd').then (resource)->
        expect(resource).to.have.property('constructor', Oshpark.Import)
        expect(resource).to.have.property('originalUrl', 'http://example.com/design.brd')

