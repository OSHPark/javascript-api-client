class Panel extends Oshpark.modelWithAttributes([ 'id', 'pcb_layers', 'scheduled_order_time', 'expected_receive_time', 'ordered_at', 'received_at', 'state', 'service', 'total_orders', 'total_boards', 'board_area_in_square_mils' ])

  pcbLayers:             -> @pcb_layers
  scheduledOrderTime:    -> @scheduled_order_time
  expectedReceiveTime:   -> @expected_receive_time
  orderedAt:             -> @ordered_at
  receivedAt:            -> @received_at
  totalOrders:           -> @total_orders
  totalBoards:           -> @total_boards
  boardAreaInSquareMils: -> @board_area_in_square_mils

Oshpark.Panel = Panel
