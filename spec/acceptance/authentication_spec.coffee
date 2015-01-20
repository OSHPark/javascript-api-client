describe 'Authentication', ->
  beforeEach ->
    @timeout   = 5000
    @client    = new Oshpark.Client url: 'https://oshpark.com/api/v1'
    @email     = '@@EMAIL'
    @password  = 'AKjdj202j3kjd092jd'
    @apiSecret = 'dj54jlsdkjlskdjflk'

  describe 'with a correct password', ->
    beforeEach -> @password = '@@PASSWORD'

    it 'resolves', ->
      expect(@client.authenticate(@email, withPassword: @password)).to.eventually.be.fulfilled

  describe 'with an incorrect password', ->
    it 'rejects', ->
      expect(@client.authenticate(@email, withPassword: @password)).to.be.rejected

  describe 'with a correct API secret', ->
    beforeEach -> @apiSecret = '@@API_SECRET'

    it 'resolves', ->
      expect(@client.authenticate(@email, withApiSecret: @apiSecret)).to.eventually.be.fulfilled

  describe 'with an incorrect API secret', ->
    it 'rejects', ->
      expect(@client.authenticate(@email, withApiSecret: @apiSecret)).to.be.rejected
