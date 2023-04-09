extends Node2D



###############
## VARIABLES ##
###############

@export var zoom_inc : float = 0.5

@onready var grid        : TextureRect = $grid
@onready var grid_center : ColorRect   = $grid_center
@onready var camera      : Camera2D    = $camera

@onready var grid_solid       : Texture = load("res://assets/grid/solid.png")
@onready var grid_solid_thick : Texture = load("res://assets/grid/solid thick.png")

var follow : bool = false
var move_start : Vector2
var move : Vector2



###############
## FUNCTIONS ##
###############

func _ready():
	chalk.onThemeChange(_on_theme_change)


func _input(event):
	if event is InputEventMouseButton:
		# panning navigation.
		if Input.is_action_just_pressed("mouse_middle"):
			follow = true
			move_start = get_local_mouse_position()
		elif Input.is_action_just_released("mouse_middle"):
			follow = false
		
		elif event.is_pressed():
			match event.button_index:
				
				# mouse wheel.
				MOUSE_BUTTON_WHEEL_UP:
					zoom(get_local_mouse_position(), 1)
				MOUSE_BUTTON_WHEEL_DOWN:
					zoom(get_local_mouse_position(), -1)
	
	# panning navigation.
	elif event is InputEventMouseMotion:
		if follow:
			camera.position += move_start - get_local_mouse_position()


func _on_theme_change():
	grid.material.set_shader_parameter("primary", chalk.theme.primary)
	grid.material.set_shader_parameter("secondary", chalk.theme.secondary)
	grid_center.color = chalk.theme.primary



func zoom(pos, inc):
	camera.zoom += Vector2(inc * zoom_inc, inc * zoom_inc)
	
	print(grid.size)
	
	if camera.zoom.x <= 0.7:
		grid.texture = grid_solid_thick
		grid.material.set_shader_parameter("grid_texture", grid_solid_thick)
	else:
		grid.texture = grid_solid
		grid.material.set_shader_parameter("grid_texture", grid_solid)


func _on_view_item_rect_changed():
	pass # Replace with function body.
