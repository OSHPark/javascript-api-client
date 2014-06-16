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

  describe '#defaultHeaders', ->

    connection = null

    beforeEach ->
      connection = new Oshpark.Connection

    it 'sets the "Accept" header', ->
      expect(connection.defaultHeaders()).to.haveOwnProperty('Accept', 'application/json')

    describe 'when there is a token', ->

      token = null
      Token = class Token
        token: -> 'abcdef'

      beforeEach ->
        token      = new Token

      it 'sets the "Authorization" header', ->
        expect(connection.defaultHeaders(token)).to.haveOwnProperty('Authorization', 'abcdef')

    describe 'when there is no token', ->

      it 'does not set the "Authorization" header', ->
        expect(connection.defaultHeaders()).not.to.haveOwnProperty('Authorization')
