@tool
extends TextureRect



@onready var camera : Camera2D = $"../camera"
var offset := Vector2(-450, -350)



func updateTextureOffset():
	material.set_shader_parameter("offset", position)


func _process(_delta):
	position = camera.position + camera.offset + (size / -2)
	updateTextureOffset()
