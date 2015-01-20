class Oshpark.Project extends Oshpark.modelWithAttributes([ 'id', 'design_file_url', 'name', 'description', 'top_image', 'bottom_image', 'width_in_mils', 'pcb_layers', 'state', 'layers' ])

  topImage:       -> new Oshpark.Image @__attrs__.top_image, @client if @__attrs__.top_image?
  bottomImage:    -> new Oshpark.Image @__attrs__.bottom_image, @client if @__attrs__.bottom_image?
  layers:         ->
    layers = []
    for layer in @__attrs__.layers
      layers.push new Oshpark.Layer layer, @client
    layers

  isNew:             -> @state == 'NEW'
  isApproved:        -> @state == 'APPROVED'
  isAwaitingRemoval: -> @state == 'AWAITING_REMOVAL'
