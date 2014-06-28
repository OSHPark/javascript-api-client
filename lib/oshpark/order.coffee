class Order extends Oshpark.modelWithAttributes([
  'id', 'board_cost', 'cancellation_reason', 'cancelled_at', 'ordered_at',
  'payment_provider', 'payment_received_at', 'project_name',  'quantity',
  'shipping_address', 'shipping_cost', 'shipping_country', 'shipping_method',
  'shipping_name', 'state', 'total_cost', 'project_id', 'panel_id' ])

  boardCost:          -> @board_cost
  cancellationReason: -> @cancellation_reason
  cancelledAt:        -> @cancelled_at
  orderedAt:          -> @ordered_at
  paymentProvider:    -> @payment_provider
  paymentReceivedAt:  -> @payment_received_at
  projectName:        -> @project_name
  shippingAddress:    -> @shipping_address
  shippingCost:       -> @shipping_cost
  shippingCountry:    -> @shipping_country
  shippingMethod:     -> @shipping_method
  shippingName:       -> @shipping_name
  totalCost:          -> @total_cost
  projectId:          -> @project_id
  panelId:            -> @panel_id

Oshpark.Order = Order
