class Connection
  constructor: (@endpointUrl)->

  request: (method, endpoint, params={}, token)->
    new RSVP.Promise (resolve,reject)->
      reject new Error "Must choose connection subclass"

  defaultHeaders: (token=null)->
    headers = {
      'Accept': 'application/json'
    }
    headers['Authorization'] = token.token if token?
    headers

Oshpark.Connection = Connection
