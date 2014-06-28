describe 'Oshpark.Client', ->

  beforeEach ->
    @jsonHeader  = {'Content-Type': 'application/json'}
    @client = new Oshpark.Client

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

  describe '#projects', ->
    jsonBody = '{"projects": [ { "id": "abcdef" }]}'

    beforeEach ->
      @server.respondWith [200, @jsonHeader, jsonBody]
      @server.autoRespond = true

    afterEach ->
      @server.restore()

    it 'is a promise', ->
      expect(@client.projects()).to.eventually.be.fulfilled

    it 'is to the correct URL', ->
      @client.projects().then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/projects')

    it 'is the correct HTTP method', ->
      @client.projects().then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')

    it 'retrieves the current users\'s projects from the API', ->
      @client.projects().then (projects)->
        projects.forEach (project)->
          expect(project).to.have.property('constructor', Oshpark.Project)
          expect(project).to.have.property('id', 'abcdef')

  describe '#project(:id)', ->
    jsonBody = '{"project": { "id": "abc123"} }'

    beforeEach ->
      @server.respondWith [200, @jsonHeader, jsonBody]
      @server.autoRespond = true

    afterEach ->
      @server.restore()

    it 'is a promise', ->
      expect(@client.project('abc123')).to.eventually.be.fulfilled

    it 'fails when not passed an id', ->
      expect(@client.project()).to.be.rejected

    it 'is to the correct URL', ->
      @client.project('abc123').then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/projects/abc123')

    it 'is the correct HTTP method', ->
      @client.project('abc123').then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')

    it 'retrieves a specific project from the API', ->
      @client.project('abc123').then (project)->
        expect(project).to.have.property('constructor', Oshpark.Project)
        expect(project).to.have.property('id', 'abc123')

  describe '#orders', ->
    jsonBody = '{"orders": [ { "id": "abcdef" }]}'

    beforeEach ->
      @server.respondWith [200, @jsonHeader, jsonBody]
      @server.autoRespond = true

    afterEach ->
      @server.restore()

    it 'is a promise', ->
      expect(@client.orders()).to.eventually.be.fulfilled

    it 'is to the correct URL', ->
      @client.orders().then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/orders')

    it 'is the correct HTTP method', ->
      @client.orders().then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')

    it 'retrieves the current users\'s orders from the API', ->
      @client.orders().then (orders)->
        orders.forEach (order)->
          expect(order).to.have.property('constructor', Oshpark.Order)
          expect(order).to.have.property('id', 'abcdef')

  describe '#order(:id)', ->
    jsonBody = '{"order": { "id": "abc123"} }'

    beforeEach ->
      @server.respondWith [200, @jsonHeader, jsonBody]
      @server.autoRespond = true

    afterEach ->
      @server.restore()

    it 'is a promise', ->
      expect(@client.order('abc123')).to.eventually.be.fulfilled

    it 'fails when not passed an id', ->
      expect(@client.order()).to.be.rejected

    it 'is to the correct URL', ->
      @client.order('abc123').then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/orders/abc123')

    it 'is the correct HTTP method', ->
      @client.order('abc123').then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')

    it 'retrieves a specific order from the API', ->
      @client.order('abc123').then (order)->
        expect(order).to.have.property('constructor', Oshpark.Order)
        expect(order).to.have.property('id', 'abc123')

  describe '#panels', ->
    jsonBody = '{"panels": [ { "id": "abcdef" }]}'

    beforeEach ->
      @server.respondWith [200, @jsonHeader, jsonBody]
      @server.autoRespond = true

    afterEach ->
      @server.restore()

    it 'is a promise', ->
      expect(@client.panels()).to.eventually.be.fulfilled

    it 'is to the correct URL', ->
      @client.panels().then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/panels')

    it 'is the correct HTTP method', ->
      @client.panels().then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')

    it 'retrieves the current users\'s panels from the API', ->
      @client.panels().then (panels)->
        panels.forEach (panel)->
          expect(panel).to.have.property('constructor', Oshpark.Panel)
          expect(panel).to.have.property('id', 'abcdef')

  describe '#panel(:id)', ->
    jsonBody = '{"panel": { "id": "abc123"} }'

    beforeEach ->
      @server.respondWith [200, @jsonHeader, jsonBody]
      @server.autoRespond = true

    afterEach ->
      @server.restore()

    it 'is a promise', ->
      expect(@client.panel('abc123')).to.eventually.be.fulfilled

    it 'fails when not passed an id', ->
      expect(@client.panel()).to.be.rejected

    it 'is to the correct URL', ->
      @client.panel('abc123').then =>
        expect(@server.lastRequest()).to.have.property('url', 'https://oshpark.com/api/v1/panels/abc123')

    it 'is the correct HTTP method', ->
      @client.panel('abc123').then =>
        expect(@server.lastRequest()).to.have.property('method', 'GET')

    it 'retrieves a specific panel from the API', ->
      @client.panel('abc123').then (panel)->
        expect(panel).to.have.property('constructor', Oshpark.Panel)
        expect(panel).to.have.property('id', 'abc123')
