`import modelWithAttributes from 'oshpark/model_with_attributes'`
`import Address from 'oshpark/address'`
`import ShippingRate from 'oshpark/shipping_rate'`
`import OrderItem from 'oshpark/order_item'`

class Order extends modelWithAttributes([
  'id', 'board_cost', 'cancellation_reason', 'cancelled_at', 'ordered_at',
  'payment_provider', 'payment_received_at', 'project_name',  'quantity',
  'shipping_address', 'shipping_cost', 'shipping_country', 'shipping_method',
  'shipping_name', 'state', 'total_cost', 'project_id', 'panel_id' ])

  address: ->
    new Address @__attrs__.address

  shippingRate: ->
    new ShippingRate @__attrs__.shipping_rate

  orderItems: ->
    for orderItem in @__attrs__.order_items
      new OrderItem orderItem, @

  isEmpty:      -> @state == 'EMPTY'
  isNew:        -> @state == 'NEW'
  isReceived:   -> @state == 'RECEIVED'
  isProcessing: -> @state == 'PROCESSING'
  isShipped:    -> @state == 'SHIPPED'
  isCancelled:  -> @state == 'CANCELLED'

  isCancellable: ->
    @isEmpty() || @isNew() || @isReceived()

`export default Order`
