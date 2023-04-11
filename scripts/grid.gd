@tool
extends TextureRect



@onready var camera : Camera2D = $"../camera"
var offset := Vector2(-450, -350)



func updateTextureOffset():
	if material:
		material.set_shader_parameter("offset", position)


func _process(_delta):
	#position = camera.position# + camera.offset + (size * scale * -0.5)
	#scale = camera.zoom
	#print("\n")
	#print(position)
	#print(Vector2(1,1) / scale)
	updateTextureOffset()
