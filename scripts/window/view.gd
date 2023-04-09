@tool
extends Control



@onready var viewport := $container/viewport
@onready var world    := $container/viewport/world
@onready var grid     := $container/viewport/world/grid



func _ready():
	_on_item_rect_changed()


func _on_item_rect_changed() -> void:
	if viewport:
		viewport.size = size
	if world:
		world.resizeGrid()
