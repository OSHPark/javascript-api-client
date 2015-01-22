`import modelWithAttributes from 'oshpark/model_with_attributes'`

class Panel extends modelWithAttributes([ 'id', 'pcb_layers', 'scheduled_order_time', 'expected_receive_time', 'ordered_at', 'received_at', 'state', 'service', 'total_orders', 'total_boards', 'board_area_in_square_mils' ])

`export default Panel`
