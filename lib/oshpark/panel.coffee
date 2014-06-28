#  attributes :pcb_layers, :scheduled_order_time, :expected_receive_time,
#               :ordered_at, :received_at, :state, :service, :total_orders,
#                            :total_boards, :board_area_in_square_mils
#
class Panel extends Oshpark.modelWithAttributes([ 'id', 'pcb_layers', 'scheduled_order_time', 'expected_receive_time', 'ordered_at', 'received_at', 'state', 'service', 'total_orders', 'total_boards', 'board_area_in_square_mils' ])

Oshpark.Panel = Panel
