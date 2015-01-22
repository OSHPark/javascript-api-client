class Connection
  constructor: (@endpointUrl)->

  request: (method, endpoint, params={}, token)->
    @_subclassesMustImplement('request')

  createUpload: ->
    @_subclassesMustImplement('createUpload')

  defaultHeaders: (token=null)->
    headers = {
      'Accept': 'application/json'
    }
    headers['Authorization'] = token.token if token?
    headers

  _subclassesMustImplement: (methodName)->
    new RSVP.Promise (resolve,reject)->
      reject new Error "Connection subclasses must implement the `#{methodName}` method."

`export default Connection`
