extends Control



func _ready():
	chalk.onThemeChange(_on_theme_change)


func _on_theme_change():
	$background.color = chalk.theme.secondary
	$border.color = chalk.theme.primary
