@tool
extends Control



@onready var viewport := $container/viewport
@onready var grid     := $container/viewport/world/grid



func _ready():
	_on_item_rect_changed()


func _on_item_rect_changed() -> void:
	if viewport:
		viewport.size = size
	if grid:
		grid.size     = DisplayServer.window_get_size()
