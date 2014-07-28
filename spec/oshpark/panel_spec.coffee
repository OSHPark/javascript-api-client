describe 'Oshpark.Panel', ->

  it 'exists', -> expect(Oshpark.Panel).to.be

  [ 'pcbLayers', 'scheduledOrderTime', 'expectedReceiveTime', 'orderedAt', 'receivedAt', 'totalOrders', 'totalBoards', 'boardAreaInSquareMils' ].forEach (method)->
    it "responds to #{method}", ->
      expect(new Oshpark.Panel({})).to.respondTo(method)
