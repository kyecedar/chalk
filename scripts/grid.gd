extends Sprite2D



@export var opacity : float = 0.2  :
	set (value):
		opacity = value
		material.set_shader_parameter("opacity", value)

@export var min_opacity : float = 0.05 :
	set (value):
		min_opacity = value
		material.set_shader_parameter("min_opacity", value)

@export var radius : float = 300  :
	set (value):
		radius = value
		material.set_shader_parameter("radius", value)



func _ready():
	opacity     = opacity
	min_opacity = min_opacity
	radius      = radius


func _process(_delta):
	updateTextureOffset()



func updateTextureOffset():
	if material:
		material.set_shader_parameter("offset", position)
