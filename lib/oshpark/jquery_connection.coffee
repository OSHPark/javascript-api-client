class JQueryConnection extends Oshpark.Connection
  request: (method, endpoint, params={}, token)->
    new RSVP.Promise (resolve,reject)->
      $.ajax
        dataType: 'json'
        data:     params
        headers:  @defaultHeaders(token)
        url:      "#{@endpointUrl}/#{endpoint}"
        type:     method
        success:  (data)->
          resolve data
        error:    (xhr,textStatus,errorThrown)->
          reject [textStatus, errorThrown]

Oshpark.JQueryConnection = JQueryConnection
