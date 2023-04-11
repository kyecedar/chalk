extends Node2D



###############
## VARIABLES ##
###############

@export var zoom_increment : float = 0.5
@export var zoom_min       : float = 0.5
@export var zoom_max       : float = 5.0

@onready var grid        : Sprite2D  = $grid
@onready var camera      : Camera2D  = $camera

@onready var grid_solid       : Texture = load("res://assets/grid/solid.png")
@onready var grid_solid_thick : Texture = load("res://assets/grid/solid thick.png")

var follow : bool = false
var move_start : Vector2
var move : Vector2



###############
## FUNCTIONS ##
###############

func _ready():
	resizeGrid()
	chalk.onThemeChange(_on_theme_change)


func _process(_delta):
	grid.position = camera.position


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
	if grid.material:
		grid.material.set_shader_parameter("primary", chalk.theme.primary)
		grid.material.set_shader_parameter("secondary", chalk.theme.secondary)



func resizeGrid():
	var size = Vector2i(Vector2(DisplayServer.window_get_size()) / camera.zoom)
	grid.region_rect = Rect2(size / -2, size)


func zoom(pos, inc):
	var z = inc * zoom_increment
	
	camera.zoom.x =  clamp(camera.zoom.x + z, zoom_min, zoom_max)
	camera.zoom.y =  camera.zoom.x
	
	if camera.zoom.x < 1:
		grid.texture = grid_solid_thick
	else:
		grid.texture = grid_solid
	
	resizeGrid()
