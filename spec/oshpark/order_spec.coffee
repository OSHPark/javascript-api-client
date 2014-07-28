describe 'Oshpark.Order', ->

  it 'exists', -> expect(Oshpark.Order).to.be

  [ 'boardCost', 'cancellationReason', 'cancelledAt', 'orderedAt', 'paymentProvider', 'paymentReceivedAt', 'projectName', 'shippingAddress', 'shippingCost', 'shippingCountry', 'shippingMethod', 'shippingName', 'totalCost', 'projectId', 'panelId' ].forEach (method)->
    it "responds to #{method}", ->
      expect(new Oshpark.Order({})).to.respondTo(method)
