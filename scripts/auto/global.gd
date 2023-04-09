extends Node



###############
## VARIABLES ##
###############

var themes : Array = [
	{
		"name": "theme 1.",
		"primary"   : "3e574f", # Outer Space
		"secondary" : "c1cd96", # Spring Green
	},
	{
		"name": "theme 2.",
		"primary"   : "fdffed", # White
		"secondary" : "d53e3b", # Mahogany
	},
	{
		"name": "theme 3.",
		"primary"   : "bf6a6d", # Fuzzy Wuzzy Brown
		"secondary" : "03034e", # Royal Purple
	},
	{
		"name": "theme 4.",
		"primary"   : "d4601b", # Orange
		"secondary" : "0d1524", # Black
	},
	{
		"name": "theme 5.",
		"primary"   : "000000",
		"secondary" : "d2ba60",
	},
	{
		"name": "theme 6.",
		"primary"   : "000000",
		"secondary" : "3dabe8",
	},
]

@export var selected_theme : int = 3
var theme_invert   := true
var theme          : Dictionary

var theme_callbacks : Array[Callable] = []



###############
## FUNCTIONS ##
###############

func _ready() -> void:
	pass



func onThemeChange(callback: Callable) -> int:
	theme_callbacks.append(callback)
	return len(theme_callbacks) - 1


func changeTheme(index: int) -> void:
	selected_theme = index
	theme = themes[selected_theme].duplicate()
	
	var primary   := Color(themes[selected_theme].primary)
	var secondary := Color(themes[selected_theme].secondary)
	
	if theme_invert:
		theme.primary   = secondary
		theme.secondary = primary
	else:
		theme.primary   = primary
		theme.secondary = secondary
	
	for callback in theme_callbacks:
		callback.call()


func quit() -> bool:
	get_tree().quit()
	return true
