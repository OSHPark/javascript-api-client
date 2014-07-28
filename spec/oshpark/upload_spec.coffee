describe 'Oshpark.Upload', ->

  it 'exists', -> expect(Oshpark.Upload).to.be

  [ 'originalFilename', 'errorMessage', 'queuedAt', 'startedAt', 'completedAt', 'erroredAt', 'failedAt', 'projectId' ].forEach (method)->
    it "responds to #{method}", ->
      expect(new Oshpark.Upload({})).to.respondTo(method)
