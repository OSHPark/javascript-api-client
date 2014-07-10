class Oshpark.JQueryConnection extends Oshpark.Connection
  constructor: ->
    super
    jQuery.ajaxSetup
      dataFilter: (data,type)->
        return null if type == 'json' && data == ''
        data

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
