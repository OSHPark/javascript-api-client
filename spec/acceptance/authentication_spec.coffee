describe 'Authentication', ->
  beforeEach ->
    @client    = new Oshpark.Client url: '@@API_URL'
    @email     = '@@EMAIL'
    @password  = 'AKjdj202j3kjd092jd'
    @apiSecret = 'dj54jlsdkjlskdjflk'

  describe 'with a correct password', ->
    beforeEach -> @password = '@@PASSWORD'

    it 'resolves', ->
      @timeout 10000
      expect(@client.authenticate(@email, withPassword: @password)).to.eventually.be.fulfilled

  describe 'with an incorrect password', ->
    it 'rejects', ->
      @timeout 10000
      expect(@client.authenticate(@email, withPassword: @password)).to.be.rejected

  describe 'with a correct API secret', ->
    beforeEach -> @apiSecret = '@@API_SECRET'

    it 'resolves', ->
      @timeout 10000
      expect(@client.authenticate(@email, withApiSecret: @apiSecret)).to.eventually.be.fulfilled

  describe 'with an incorrect API secret', ->
    it 'rejects', ->
      @timeout 10000
      expect(@client.authenticate(@email, withApiSecret: @apiSecret)).to.be.rejected
