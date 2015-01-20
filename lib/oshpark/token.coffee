class Oshpark.Token extends Oshpark.modelWithAttributes(['token', 'ttl', 'user_id'])
  constructor: (json)->
    super json
    @user = new Oshpark.User id: @userId if @userId?
