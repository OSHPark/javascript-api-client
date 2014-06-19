beforeEach ->
  @server = sinon.fakeServer.create()
  @server.lastRequest = =>
    @server.requests[@server.requests.length - 1]

afterEach ->
  @server.restore()
