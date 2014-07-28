describe 'Oshpark.Import', ->

  it 'exists', -> expect(Oshpark.Import).to.be

  [ 'originalUrl', 'originalFilename', 'errorMessage', 'queuedAt', 'startedAt', 'completedAt', 'erroredAt', 'failedAt', 'projectId' ].forEach (method)->
    it "responds to #{method}", ->
      expect(new Oshpark.Import({})).to.respondTo(method)
