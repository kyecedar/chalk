extends Control



###############
## VARIABLES ##
###############

@onready var background            := $background
@onready var title                 := $title
@onready var pin                   := $pin
@onready var minimize              := $buttons/minimize
@onready var maximize              := $buttons/maximize
@onready var close                 := $buttons/close
@onready var pin_background        := $pin/background
@onready var pin_active_background := $pin/active_background
@onready var minimize_background   := $buttons/minimize/background
@onready var maximize_background   := $buttons/maximize/background
@onready var close_background      := $buttons/close/background

@export var button_width  : int = 35
@export var title_padding : int = 7

var left_size = button_width + title_padding
var right_size = button_width * 3 + title_padding

var maximized       := false
var following       := false
var drag_start      := Vector2()
var drag_fullscreen := false
var last_pos        := Vector2()
var last_size       := Vector2()
var pin_toggle      := false

var tobemaximized    := false
var last_window_mode : int



###############
## FUNCTIONS ##
###############

func _ready() -> void:
	chalk.onThemeChange(_on_theme_change)
	_on_item_rect_changed()


func _process(_delta) -> void:
	if following:
		DisplayServer.window_set_position(DisplayServer.window_get_position() + Vector2i(get_global_mouse_position() - drag_start))
	elif tobemaximized:
		if last_window_mode == DisplayServer.WINDOW_MODE_MINIMIZED && DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_WINDOWED:
			_on_maximize_pressed()
			tobemaximized = false
		else:
			last_window_mode = DisplayServer.window_get_mode()
			


func _on_theme_change() -> void:
	background.color = chalk.theme.primary
	
	pin.self_modulate      = Color(chalk.theme.secondary, 0.5)
	minimize.self_modulate = chalk.theme.secondary
	maximize.self_modulate = chalk.theme.secondary
	close.self_modulate    = chalk.theme.secondary
	
	pin_background.color        = chalk.theme.primary
	pin_active_background.color = chalk.theme.primary
	minimize_background.color   = chalk.theme.primary
	maximize_background.color   = chalk.theme.primary
	close_background.color      = chalk.theme.primary
	
	title.label_settings.font_color = chalk.theme.secondary


func _on_background_gui_input(event) -> void:
	if event is InputEventMouseButton:
		var mode : int = DisplayServer.window_get_mode()
		
		if Input.is_action_just_pressed("mouse_left"):
			following = true
			
			drag_start = get_local_mouse_position()
			
			if mode == DisplayServer.WINDOW_MODE_FULLSCREEN or mode == DisplayServer.WINDOW_MODE_MAXIMIZED:
				drag_start.x -= left_size
				drag_start = Vector2(
					round((last_size.x - left_size - right_size) * (float(drag_start.x) / (DisplayServer.window_get_size().x - left_size - right_size))),
					drag_start.y)
				drag_start.x += left_size
			
			# TODO: Check if user is tryna drag window while it's fullscreen.
			# and calucate the place to put the mouse
		elif Input.is_action_just_released("mouse_left"):
			# if user is dragging the window and their mouse is close to the top of a monitor, make it fullscreen.
			if drag_fullscreen && following:
				# calculate 
				pass
			
			following = false
	elif event is InputEventMouseMotion:
		var mode : int = DisplayServer.window_get_mode()
		
		if following:
			if mode == DisplayServer.WINDOW_MODE_FULLSCREEN or mode == DisplayServer.WINDOW_MODE_MAXIMIZED:
				_on_maximize_pressed()
			else:
				pass
				# TODO: Check if user drags window to top of screen to fullscreen.
				#if mouse is in area of window-drag-to-fullscreen-ness, do that shit on mouse release
					#drag_fullscreen = true
			pass


func _on_item_rect_changed() -> void:
	if title:
		title.position.x = button_width + title_padding
		title.size.x = DisplayServer.window_get_size().x - (button_width * 4 + title_padding * 2)


###### on button press.

func _on_pin_toggled(button_pressed) -> void:
	pin_toggle = !DisplayServer.window_get_flag(DisplayServer.WINDOW_FLAG_ALWAYS_ON_TOP)
	
	DisplayServer.window_set_flag(
		DisplayServer.WINDOW_FLAG_ALWAYS_ON_TOP,
		pin_toggle)
	
	pin.self_modulate = Color(
		chalk.theme.primary if pin_toggle else chalk.theme.secondary,
		1.0 if pin_toggle else 0.5)
	pin_background.color = chalk.theme.secondary
	pin_active_background.color = chalk.theme.secondary if pin_toggle else chalk.theme.primary


func _on_minimize_pressed() -> void:
	if maximized:
		tobemaximized = true
		_on_maximize_pressed()
	DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_MINIMIZED)


func _on_maximize_pressed() -> void:
	var mode : int = DisplayServer.window_get_mode()
	
	maximized = (mode == DisplayServer.WINDOW_MODE_FULLSCREEN or mode == DisplayServer.WINDOW_MODE_MAXIMIZED)
	
	if mode == DisplayServer.WINDOW_MODE_FULLSCREEN or mode == DisplayServer.WINDOW_MODE_MAXIMIZED:
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)
		DisplayServer.window_set_position(last_pos)
		DisplayServer.window_set_size(last_size)
	else:
		last_pos  = DisplayServer.window_get_position()
		last_size = DisplayServer.window_get_size()
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_MAXIMIZED)
	
	maximized = !maximized


func _on_close_pressed() -> void:
	chalk.quit()





func _on_minimize_mouse_entered() -> void:
	if following:
		return
	minimize.self_modulate = chalk.theme.primary
	minimize_background.color = chalk.theme.secondary


func _on_minimize_mouse_exited() -> void:
	minimize.self_modulate = chalk.theme.secondary
	minimize_background.color = chalk.theme.primary


func _on_maximize_mouse_entered() -> void:
	if following:
		return
	maximize.self_modulate = chalk.theme.primary
	maximize_background.color = chalk.theme.secondary


func _on_maximize_mouse_exited() -> void:
	maximize.self_modulate = chalk.theme.secondary
	maximize_background.color = chalk.theme.primary


func _on_close_mouse_entered() -> void:
	if following:
		return
	close.self_modulate = chalk.theme.primary
	close_background.color = chalk.theme.secondary


func _on_close_mouse_exited() -> void:
	close.self_modulate = chalk.theme.secondary
	close_background.color = chalk.theme.primary


func _on_pin_mouse_entered() -> void:
	if following:
		return
	pin.self_modulate = Color(chalk.theme.primary if pin_toggle else chalk.theme.secondary, 1.0)
	pin_background.color = chalk.theme.secondary


func _on_pin_mouse_exited() -> void:
	pin.self_modulate = Color(chalk.theme.primary if pin_toggle else chalk.theme.secondary, 1.0 if pin_toggle else 0.5)
	pin_background.color = chalk.theme.primary
