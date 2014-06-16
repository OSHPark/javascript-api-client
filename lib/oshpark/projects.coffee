class Project extends Oshpark.modelWithAttributes([ 'id', 'design_file_url', 'name', 'description', 'top_image', 'bottom_image', 'width_in_mils', 'pcb_layers', 'state', 'layers' ])
  constructor: (json)->
    super json
    @top_image    = new Oshpark.Image @top_image if @top_image?
    @bottom_image = new Oshpark.Image @bottom_image if @bottom_image?

    @width_in_inches  = @width_in_mils    / 1000.0 if @width_in_mils?
    @height_in_inches = @height_in_mils   / 1000.0 if @height_in_mils?
    @width_in_mm      = @width_in_inches  / 25.4   if @width_in_inches?
    @height_in_mm     = @height_in_inches / 25.4   if @height_in_inches?

Oshpark.Project = Project
