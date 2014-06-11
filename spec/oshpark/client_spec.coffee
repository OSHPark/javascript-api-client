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

