class Connection
  constructor: (@endpointUrl)->

  request: (method, endpoint, params={}, token)->
    new RSVP.Promise (resolve,reject)->
      reject "Must choose connection subclass"

  defaultHeaders: (token=null)->
    headers = {
      'Accept': 'application/json'
    }
    headers['Authorization'] = token.token() if token?
    headers

Oshpark.Connection = Connection
