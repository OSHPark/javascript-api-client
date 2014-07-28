describe 'Oshpark.Image', ->

  it 'exists', -> expect(Oshpark.Image).to.be

  ['thumbUrl', 'largeUrl', 'originalUrl'].forEach (method)->
    it "responds to #{method}", ->
      expect(new Oshpark.Image({})).to.respondTo(method)
