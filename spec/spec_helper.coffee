window.xhrMock = null
window.xhrRequests = []

beforeEach ->
  window.xhrMock = sinon.useFakeXMLHttpRequest()
  xhrMock.onCreate = (xhr)->
    xhrRequests.push xhr

afterEach ->
  xhrMock.restore()
  window.xhrRequests = []
