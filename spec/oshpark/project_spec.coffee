describe 'Oshpark.Project', ->

  it 'exists', -> expect(Oshpark.Project).to.be

  ['topImage', 'bottomImage', 'widthInMils', 'heightInMils', 'widthInInches', 'heightInInches', 'widthInMm', 'heightInMm' ].forEach (method)->
    it "responds to #{method}", ->
      expect(new Oshpark.Project({})).to.respondTo(method)

  describe '#topImage', ->
    it 'is an Image', ->
      expect(new Oshpark.Project(top_image: {}).topImage()).to.be.an.instanceof(Oshpark.Image)

  describe '#bottomImage', ->
    it 'is an Image', ->
      expect(new Oshpark.Project(bottom_image: {}).bottomImage()).to.be.an.instanceof(Oshpark.Image)
