describe 'Oshpark.Connection', ->
  connection = null

  beforeEach ->
    connection = new Oshpark.Connection

  it 'exists', ->
    expect(Oshpark.Connection).to.exist

  describe '#request', ->

    it 'rejects', ->
      expect(connection.request()).to.be.rejected

  describe '#createUpload', ->

    it 'rejects', ->
      expect(connection.request()).to.be.rejected

  describe '#defaultHeaders', ->

    describe 'when there is no token', ->

      it 'sets the Accept header', ->
        expect(connection.defaultHeaders()).to.have.ownProperty('Accept', 'application/json')

    describe 'when there is a token', ->
      token = null

      beforeEach ->
        token = {token: -> 'abcdefg'}

      it 'sets the Accept header', ->
        expect(connection.defaultHeaders(token)).to.have.ownProperty('Accept', 'application/json')

      it 'sets the Authorization header', ->
        expect(connection.defaultHeaders(token)).to.have.ownProperty('Authorization', 'abcdefg')
