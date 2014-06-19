describe 'Oshpark.Client', ->
  client = null

  beforeEach ->
    client = new Oshpark.Client

  it 'exists', ->
    expect(Oshpark.Client).to.exist

  describe '#constructor', ->

    describe 'default arguments', ->

      it 'creates a JQueryConnection', ->
        expect(client.connection).to.be.an.instanceof(Oshpark.JQueryConnection)

      it 'sets the URL to "https://oshpark.com/api/v1"', ->
        expect(client.connection).to.haveOwnProperty('endpointUrl', "https://oshpark.com/api/v1")

    describe 'setting URL', ->

      beforeEach ->
        client = new Oshpark.Client url: 'foo.com'

      it 'creates a JQueryConnection', ->
        expect(client.connection).to.be.an.instanceof(Oshpark.JQueryConnection)

      it 'sets the URL', ->
        expect(client.connection).to.haveOwnProperty('endpointUrl', "foo.com")

    describe 'setting the connection class', ->

      fakeConnection = null

      beforeEach ->
        fakeConnection = class FakeConnection extends Oshpark.Connection
        client = new Oshpark.Client connection: fakeConnection

      it 'creates a connection', ->
        expect(client.connection).to.be.an.instanceof(fakeConnection)

      it 'sets the URL to "https://oshpark.com/api/v1"', ->
        expect(client.connection).to.haveOwnProperty('endpointUrl', "https://oshpark.com/api/v1")

  describe '#authenticate', ->

    jsonBody    = '{"api_session_token":{"token":"abcd1234","ttl":1199,"user_id":"123"}}'
    jsonHeader  = {'Content-Type': 'application/json'}
    lastRequest = null

    beforeEach ->
      @server.respondWith [201, jsonHeader, jsonBody]
      @server.autoRespond = true
      client = new Oshpark.Client

    afterEach ->
      @server.restore()

    describe 'when authenticating with a password', ->

      it 'refreshes the user\'s token with the email address and password', ->
        client.authenticate 'user@example.com', withPassword: 'myPassword'
          .then =>
            expect(@server.lastRequest()).to.have.property('requestBody', 'email=user%40example.com&password=myPassword')

    describe 'when authenticating with an API secret', ->

      it 'refreshes the user\'s token with the email address and computed API key', ->
        client.authenticate 'user@example.com', withApiSecret: 'mySecret'
          .then =>
            expect(@server.lastRequest()).to.have.property('requestBody', 'email=user%40example.com&api_key=5bce1d7d2cd70a8559157a78ec7ab018f533cc54b9cd5b8bbc05bc4be32fd2e4')
