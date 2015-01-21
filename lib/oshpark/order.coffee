class Oshpark.Order extends Oshpark.modelWithAttributes([
  'id', 'board_cost', 'cancellation_reason', 'cancelled_at', 'ordered_at',
  'payment_provider', 'payment_received_at', 'project_name',  'quantity',
  'shipping_address', 'shipping_cost', 'shipping_country', 'shipping_method',
  'shipping_name', 'state', 'total_cost', 'project_id', 'panel_id' ])

  address: ->
    new Oshpark.Address @__attrs__.address

  shippingRate: ->
    new Oshpark.ShippingRate @__attrs__.shipping_rate

  isEmpty:      -> @state == 'EMPTY'
  isNew:        -> @state == 'NEW'
  isReceived:   -> @state == 'RECEIVED'
  isProcessing: -> @state == 'PROCESSING'
  isShipped:    -> @state == 'SHIPPED'
  isCancelled:  -> @state == 'CANCELLED'
