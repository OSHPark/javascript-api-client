`import modelWithAttributes from 'oshpark/model_with_attributes'`

class OrderItem extends modelWithAttributes([ 'name', 'batches', 'batch_cost', 'sub_total', 'price', 'quantity', 'state', 'confirmed_at', 'panelized_at', 'ordered_at', 'fabbed_at', 'shipped_at', 'project_id', 'order_item_option_selections' ])

`export default OrderItem`
