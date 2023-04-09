#        _           _   _
#  ___. | |_.  ___. | | | |_.
# / _/_ | / | / _ | | | | / /
# \___/ |_|_| \_,_| |_| |_\_\ by kye.

extends Control



###############
## VARIABLES ##
###############

@onready var content    := $content
@onready var background := $background

var drag_margins := Vector2i(2, 2)



func _ready() -> void:
	chalk.onThemeChange(_on_theme_change)
	chalk.changeTheme(chalk.selected_theme)


func _process(_delta) -> void:
	pass


func _on_theme_change() -> void:
	background.color = chalk.theme.primary


