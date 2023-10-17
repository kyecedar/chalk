enum MOUSE_BUTTON { // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
	LEFT = 0,
	MIDDLE = 1,
	RIGHT = 2,
	BACK = 3,
	FORWARD = 4,
}

// HAHA OUCH ouch :(
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
type KeyCode = 
	"Escape" | "Digit1" | "Digit2" | "Digit3" | "Digit4" | "Digit5" | "Digit6" | "Digit7" | "Digit8" | "Digit9" | "Digit0" | 
	"Minus" | "Equal" | "Backspace" | "Tab" | "KeyQ" | "KeyW" | "KeyE" | "KeyR" | "KeyT" | "KeyY" | "KeyU" | "KeyI" | "KeyO" | 
	"KeyP" | "BracketLeft" | "BracketRight" | "Enter" | "ControlLeft" | "KeyA" | "KeyS" | "KeyD" | "KeyF" | "KeyG" | "KeyH" | 
	"KeyJ" | "KeyK" | "KeyL" | "Semicolon" | "Quote" | "Backquote" | "ShiftLeft" | "Backslash" | "KeyZ" | "KeyX" | "KeyC" | 
	"KeyV" | "KeyB" | "KeyN" | "KeyM" | "Comma" | "Period" | "Slash" | "ShiftRight" | "NumpadMultiply" | "AltLeft" | "Space" | 
	"CapsLock" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "Pause" | "ScrollLock" | "Numpad7" | 
	"Numpad8" | "Numpad9" | "NumpadSubtract" | "Numpad4" | "Numpad5" | "Numpad6" | "NumpadAdd" | "Numpad1" | "Numpad2" | 
	"Numpad3" | "Numpad0" | "NumpadDecimal" | "IntlBackslash" | "F11" | "F12" | "NumpadEqual" | "F13" | "F14" | "F15" | 
	"F16" | "F17" | "F18" | "F19" | "F20" | "F21" | "F22" | "F23" | "KanaMode" | "Lang2" | "Lang1" | "IntlRo" | "F24" | 
	"Convert" | "NonConvert" | "IntlYen" | "NumpadComma" | "" | "MediaTrackPrevious" | "" | "MediaTrackNext" | "NumpadEnter" | 
	"ControlRight" | "AudioVolumeMute" | "LaunchApp2" | "MediaPlayPause" | "MediaStop" | "BrowserHome" | "NumpadDivide" | 
	"PrintScreen" | "AltRight" | "NumLock" | "Pause" | "Home" | "ArrowUp" | "PageUp" | "ArrowLeft" | "ArrowRight" | "End" | 
	"ArrowDown" | "PageDown" | "Insert" | "Delete" | "MetaLeft" | "MetaRight" | "ContextMenu" | "Power" | "BrowserSearch" | 
	"BrowserFavorites" | "BrowserRefresh" | "BrowserStop" | "BrowserForward" | "BrowserBack" | "LaunchApp1" | "LaunchMail" | "MediaSelect";

type KeyCallback = (event: KeyboardEvent) => void;
type MouseCallback = (event: MouseEvent) => void;
type WheelCallback = (event: WheelEvent) => void;

type KeyInputName = "keydown" | "keyup";
type MouseInputName = "mousemove" | "mouseenter" | "buttondown" | "buttonup";

const _keys : KeyPressedData = {};
const _buttons : Array<boolean> = new Array<boolean>(5);

const _keydown_callbacks    : Array<KeyCallback>   = [];
const _keyup_callbacks      : Array<KeyCallback>   = [];
const _mousemove_callbacks  : Array<MouseCallback> = [];
const _mouseenter_callbacks : Array<MouseCallback> = [];
const _mousedown_callbacks  : Array<MouseCallback> = [];
const _mouseup_callbacks    : Array<MouseCallback> = [];
const _wheel_callbacks      : Array<WheelCallback> = [];

const _input = {
	MOUSE_BUTTON,
	key: {
		down: (code: KeyCode): boolean => {
			if(_keys[code]) return true;
			return false;
		},
	},
	mouse: {
		pos: {
			x: 0,
			y: 0,
		},
		down: (code: MOUSE_BUTTON): boolean => {
			if(_buttons[code]) return true;
			return false;
		},
	},
	add_key_callback: (event: KeyInputName, callback: KeyCallback) => {
		switch(event) {
			case "keydown":
				_keydown_callbacks.push(callback);
				break;
			case "keyup":
				_keyup_callbacks.push(callback);
				break;
		}
	},
	add_mouse_callback: (event: MouseInputName, callback: MouseCallback) => {
		switch(event) {
			case "mousemove":
				_mousemove_callbacks.push(callback);
				break;
			case "mouseenter":
				_mouseenter_callbacks.push(callback);
				break;
			case "buttondown":
				_mousedown_callbacks.push(callback);
				break;
			case "buttonup":
				_mouseup_callbacks.push(callback);
				break;
		}
	},
	add_wheel_callback: (callback: WheelCallback) => {
		_wheel_callbacks.push(callback);
	},
};

interface KeyPressedData {
	[key: string]: boolean;
}

export async function init() {
	// KEYBOARD.
	window.addEventListener("keydown", on_key_down);
	window.addEventListener("keyup", on_key_up);

	// MOUSE.
	window.addEventListener("mousemove", on_mouse_move);
	window.addEventListener("mousedown", on_mouse_down);
	window.addEventListener("mouseup", on_mouse_up);
	window.addEventListener("mouseenter", on_mouse_enter);
	window.addEventListener("wheel", on_wheel);

	// https://github.com/tauri-apps/tauri/issues/7418
	// https://github.com/tauri-apps/tauri/discussions/3844
	// https://stackoverflow.com/questions/3527041/prevent-any-form-of-page-refresh-using-jquery-javascript
	// https://stackoverflow.com/questions/2482059/disable-f5-and-browser-refresh-using-javascript
	// prevent refresh. literally only added jquery for these 4 lines.
	// $(document).on("keydown", (evt) => {
	// 	if(evt.code === "F5")
	// 		evt.preventDefault();
	// });
	// https://stackoverflow.com/a/29847416
	// 😀 all i needed to do was this what the fuck.
	document.onkeydown = (evt) => {
		// prevent refresh.
		// gotta have this line first or else javascript will make me lose my fucking mind.
		if(evt.code === "F5") evt.preventDefault();
		else if(evt.ctrlKey)
			if(evt.code === "KeyR")
				evt.preventDefault();
	};
}

let keydown_index: number;

const on_key_down = (evt: KeyboardEvent) => {
	_keys[evt.code] = true;
	for(keydown_index = 0; keydown_index < _keydown_callbacks.length; ++keydown_index)
		_keydown_callbacks[keydown_index](evt);
};

let keyup_index: number;

const on_key_up = (evt: KeyboardEvent) => {
	_keys[evt.code] = false;
	for(keyup_index = 0; keyup_index < _keyup_callbacks.length; ++keyup_index)
		_keyup_callbacks[keyup_index](evt);
};

let mousemove_index: number;

const on_mouse_move = (evt: MouseEvent) => {
	input.mouse.pos.x = evt.clientX;
	input.mouse.pos.y = evt.clientY;
	for(mousemove_index = 0; mousemove_index < _mousemove_callbacks.length; ++mousemove_index)
		_mousemove_callbacks[mousemove_index](evt);
};

let mousedown_index: number;

const on_mouse_down = (evt: MouseEvent) => {
	_buttons[evt.button] = true;
	for(mousedown_index = 0; mousedown_index < _mousedown_callbacks.length; ++mousedown_index)
		_mousedown_callbacks[mousedown_index](evt);
};

let mouseup_index: number;

const on_mouse_up = (evt: MouseEvent) => {
	_buttons[evt.button] = false;
	for(mouseup_index = 0; mouseup_index < _mouseup_callbacks.length; ++mouseup_index)
		_mouseup_callbacks[mouseup_index](evt);
};

let mouseenter_index: number;

const on_mouse_enter = (evt: MouseEvent) => {
	on_mouse_move(evt);
	for(mouseenter_index = 0; mouseenter_index < _mouseenter_callbacks.length; ++mouseenter_index)
		_mouseenter_callbacks[mouseenter_index](evt);
};

let wheel_index: number;

// https://stackoverflow.com/a/67308650
const on_wheel = (evt: WheelEvent) => {
	for(wheel_index = 0; wheel_index < _wheel_callbacks.length; ++wheel_index)
		_wheel_callbacks[wheel_index](evt);
};

declare global {
	var input: typeof _input;
}

globalThis.input = _input;

export {};