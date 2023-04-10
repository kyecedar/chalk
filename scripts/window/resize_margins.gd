extends Control



enum SIDE {
	TL, T, TR,
	L,      R,
	BL, B, BR
}

@onready var top    := $top
@onready var bottom := $bottom
@onready var left   := $left
@onready var right  := $right

@onready var tl := $tl
@onready var tr := $tr
@onready var bl := $bl
@onready var br := $br

var following  := false
var drag_start := Vector2i()
var min_size   := Vector2i()
var win_size   := Vector2i()
var win_tl     := Vector2i()
var win_br     := Vector2i()




# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func drag(event: InputEvent, side: SIDE) -> void:
	if event is InputEventMouseButton:
		if Input.is_action_just_pressed("mouse_left"):
			following = true
			drag_start = get_local_mouse_position()
			min_size = DisplayServer.window_get_min_size()
			win_size = DisplayServer.window_get_size()
			win_tl   = DisplayServer.window_get_position_with_decorations()
			win_br   = win_tl + win_size
		if Input.is_action_just_released("mouse_left"):
			following = false
	
	elif event is InputEventMouseMotion && following:
		var drag_vec := Vector2i(get_local_mouse_position()) - drag_start
		var new_size : Vector2i
		
		match side:
			SIDE.TL:
				pass
			SIDE.T:
				pass
			SIDE.TR:
				pass
			SIDE.L:
				pass
			SIDE.R:
				drag_vec.y = 0 # ignore y.
				new_size = win_size + drag_vec
			SIDE.BL:
				pass
			SIDE.B:
				drag_vec.x = 0 # ignore x.
				new_size = win_size + drag_vec
			SIDE.BR:
				new_size = win_size + drag_vec
		
		new_size.x = max(new_size.x, min_size.x) # keep above minimum
		new_size.y = max(new_size.y, min_size.y) # keep above minimum
		
		DisplayServer.window_set_size(new_size)


#func _on_background_gui_input(event) -> void:
#	if event is InputEventMouseButton:
#		var mode : int = DisplayServer.window_get_mode()
#
#		if Input.is_action_just_pressed("mouse_left"):
#			following = true
#
#			drag_start = get_local_mouse_position()
#
#			if mode == DisplayServer.WINDOW_MODE_FULLSCREEN or mode == DisplayServer.WINDOW_MODE_MAXIMIZED:
#				drag_start.x -= left_size
#				drag_start = Vector2i(
#					round((last_size.x - left_size - right_size) * (float(drag_start.x) / (DisplayServer.window_get_size().x - left_size - right_size))),
#					drag_start.y)
#				drag_start.x += left_size
#
#			# TODO: Check if user is tryna drag window while it's fullscreen.
#			# and calucate the place to put the mouse
#		elif Input.is_action_just_released("mouse_left"):
#			# if user is dragging the window and their mouse is close to the top of a monitor, make it fullscreen.
#			if drag_fullscreen && following:
#				# calculate 
#				pass
#
#			following = false
#	elif event is InputEventMouseMotion:
#		var mode : int = DisplayServer.window_get_mode()
#
#		if following:
#			if mode == DisplayServer.WINDOW_MODE_FULLSCREEN or mode == DisplayServer.WINDOW_MODE_MAXIMIZED:
#				_on_maximize_pressed()
#			else:
#				pass
#				# TODO: Check if user drags window to top of screen to fullscreen.
#				#if mouse is in area of window-drag-to-fullscreen-ness, do that shit on mouse release
#					#drag_fullscreen = true
#			pass




func _on_top_gui_input(event):
	drag(event, SIDE.T)

func _on_bottom_gui_input(event):
	drag(event, SIDE.B)

func _on_left_gui_input(event):
	drag(event, SIDE.L)

func _on_right_gui_input(event):
	drag(event, SIDE.R)

func _on_tl_gui_input(event):
	drag(event, SIDE.TL)

func _on_tr_gui_input(event):
	drag(event, SIDE.TR)

func _on_bl_gui_input(event):
	drag(event, SIDE.BL)

func _on_br_gui_input(event):
	drag(event, SIDE.BR)
