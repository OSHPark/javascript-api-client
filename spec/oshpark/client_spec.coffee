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

  ['project', 'order', 'panel'].forEach (resource_name)->
    resources_name  = "#{resource_name}s"
    resource_klass  = Oshpark[resource_name.charAt(0).toUpperCase() + resource_name.slice(1).toLowerCase()]

    describe "##{resources_name}", ->
      jsonBody = "{\"#{resources_name}\": [{ \"id\": \"abcdef\" }]}"

      beforeEach ->
        @server.respondWith [200, @jsonHeader, jsonBody]
        @server.autoRespond = true

      afterEach -> @server.restore()

      it 'is a promise', ->
        expect(@client[resources_name]()).to.eventually.be.fulfilled

      it 'is to the correct URL', ->
        @client[resources_name]().then =>
          expect(@server.lastRequest()).to.have.property('url', "https://oshpark.com/api/v1/#{resources_name}")

      it 'is the correct HTTP method', ->
        @client[resources_name]().then =>
          expect(@server.lastRequest()).to.have.property('method', 'GET')

      it "retrieves the current users\'s #{resources_name} from the API", ->
        @client[resources_name]().then (resources)->
          resources.forEach (resource)->
            expect(resource).to.have.property('constructor', resource_klass)
            expect(resource).to.have.property('id', 'abcdef')

    describe "##{resource_name}(:id)", ->
      jsonBody = "{\"#{resource_name}\": { \"id\": \"abc123\" } }"

      beforeEach ->
        @server.respondWith [200, @jsonHeader, jsonBody]
        @server.autoRespond = true

      afterEach -> @server.restore()

      it 'is a promise', ->
        expect(@client[resource_name]('abc123')).to.eventually.be.fulfilled

      it 'fails when not passed an id', ->
        expect(@client[resource_name]()).to.be.rejected

      it 'is to the correct URL', ->
        @client[resource_name]('abc123').then =>
          expect(@server.lastRequest()).to.have.property('url', "https://oshpark.com/api/v1/#{resources_name}/abc123")

      it 'is the correct HTTP method', ->
        @client[resource_name]('abc123').then =>
          expect(@server.lastRequest()).to.have.property('method', 'GET')

      it "retrieves a specific #{resource_name} from the API", ->
        @client[resource_name]('abc123').then (project)->
          expect(project).to.have.property('constructor', resource_klass)
          expect(project).to.have.property('id', 'abc123')

