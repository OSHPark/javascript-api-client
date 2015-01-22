`import modelWithAttributes from 'oshpark/model_with_attributes'`
`import User from 'oshpark/user'`

class Token extends modelWithAttributes(['token', 'ttl', 'user_id'])
  constructor: (json)->
    super json
    @user = new User id: @userId if @userId?

`export default Token`
