describe 'Oshpark.JQueryConnection', ->

  connection = null

  beforeEach ->
    connection = new Oshpark.JQueryConnection "https://oshpark.com/api/v1/"

  describe '#request', ->

    beforeEach ->
      sinon.stub(jQuery, 'ajax')

    afterEach ->
      jQuery.ajax.restore()

    it 'delegates to jQuery.ajax', ->
      connection.request("POST", "sessions", {})
      expect(jQuery.ajax).to.have.been.calledOnce
