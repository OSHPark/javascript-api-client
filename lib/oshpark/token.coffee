class Token extends Oshpark.modelWithAttributes(['token', 'ttl', 'user_id'])
  constructor: (json)->
    super json
    @user = new Oshpark.User id: @user_id if @user_id?

Oshpark.Token = Token