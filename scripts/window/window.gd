#        _           _   _
#  ___. | |_.  ___. | | | |_.
# / _/_ | / | / _ | | | | / /
# \___/ |_|_| \_,_| |_| |_\_\ by kye.

extends Control



###############
## VARIABLES ##
###############

@export var min_size    := Vector2(300, 330)

@onready var content    := $content
@onready var background := $background
@onready var resize     := $resize_margins

var drag_margins := Vector2i(2, 2)



func _ready() -> void:
	DisplayServer.window_set_min_size(min_size)
	chalk.onThemeChange(_on_theme_change)
	chalk.changeTheme(chalk.selected_theme)


func _process(_delta) -> void:
	pass


func _on_theme_change() -> void:
	background.color = chalk.theme.primary




func _on_item_rect_changed():
	if resize:
		# Todo, redo. since this can be bypassed by setting the window size to
		# the screen size and pressing the maximize button.
		var mode : int = DisplayServer.window_get_mode()
		
		if mode == DisplayServer.WINDOW_MODE_FULLSCREEN or mode == DisplayServer.WINDOW_MODE_MAXIMIZED:
			resize.hide()
		else:
			resize.show()
