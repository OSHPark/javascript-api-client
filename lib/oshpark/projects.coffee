class Project extends Oshpark.modelWithAttributes([ 'id', 'design_file_url', 'name', 'description', 'top_image', 'bottom_image', 'width_in_mils', 'pcb_layers', 'state', 'layers' ])

  topImage:       -> new Oshpark.Image @top_image if @top_image?
  bottomImage:    -> new Oshpark.Image @bottom_image if @bottom_image?
  widthInMils:    -> @width_in_mils  || 0
  heightInMils:   -> @height_in_mils || 0
  widthInInches:  -> @widthInMils    / 1000.0
  heightInInches: -> @heightInMils   / 1000.0
  widthInMm:      -> @widthInInches  / 25.4
  heightInMm:     -> @heightInInches / 25.4

Oshpark.Project = Project
