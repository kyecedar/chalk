shader_type canvas_item;

uniform sampler2D grid_texture: filter_nearest, repeat_enable;
uniform vec4 primary : source_color;
uniform vec4 secondary : source_color;
uniform float opacity;
uniform float min_opacity;
uniform vec2 offset;
uniform int radius;

void fragment() {
	vec2  res    = vec2(1) / SCREEN_PIXEL_SIZE; // pixel resolution.
	vec2  center = res / vec2(2); // center of the screen.
	vec2  pixel  = res * SCREEN_UV; // pixel position.
	
	// distance to center from 0-1. relative to radius var.
	float dist = min(distance(center, pixel), float(radius)) / float(radius);
	
	COLOR = texture(TEXTURE, (offset * TEXTURE_PIXEL_SIZE) + UV);
	COLOR = secondary * COLOR; // modulate the color to the secondary colour.
	COLOR = vec4(mix(primary.rgb, COLOR.rgb, opacity), COLOR.a);
	
	vec4 back = mix(primary, secondary, min_opacity);
	
	COLOR = vec4(mix(COLOR.rgb, back.rgb, smoothstep(0, 1, dist)), COLOR.a);
	
	
	/*
	COLOR = texture(TEXTURE, (offset * TEXTURE_PIXEL_SIZE) + UV);
	COLOR = secondary * COLOR; // modulate the color to the secondary colour.
	COLOR = vec4(mix(primary.rgb, COLOR.rgb, opacity * COLOR.a), min(COLOR.a, primary.a)); // maximum-opacity color.
	
	// minimum-opacity color.
	vec4 b = vec4(mix(primary.rgb, COLOR.rgb, min_opacity), min(COLOR.a, primary.a));
	
	// distance to center from 0-1. relative to radius var.
	float dist = min(distance(center, pixel), float(radius)) / float(radius);
	
	// final colour. mixing the max and min opacity colors depending on distance to centre.
	COLOR = vec4(mix(COLOR.rgb, b.rgb, smoothstep(0, 1, dist)), min(COLOR.a, b.a));
	*/
}
