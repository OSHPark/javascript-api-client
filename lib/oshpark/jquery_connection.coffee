class JQueryConnection extends Oshpark.Connection
  request: (method, endpoint, params={}, token)->
    headers = @defaultHeaders(token)
    url     = "#{@endpointUrl}/#{endpoint}"
    new RSVP.Promise (resolve,reject)->
      jQuery.ajax
        dataType: 'json'
        data:     params
        headers:  headers
        url:      url
        type:     method
        success:  (data)->
          resolve data
        error:    (xhr,textStatus,errorThrown)->
          reject errorThrown

Oshpark.JQueryConnection = JQueryConnection
