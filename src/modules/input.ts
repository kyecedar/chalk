enum MOUSE_BUTTON { // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
	LEFT    = 0,
	MIDDLE  = 1,
	RIGHT   = 2,
	BACK    = 3,
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

const keys : KeyPressedData = {};
const buttons : Array<boolean> = new Array<boolean>(5);

const keyDownCallbacks    : Array<KeyCallback>   = [];
const keyUpCallbacks      : Array<KeyCallback>   = [];
const mouseMoveCallbacks  : Array<MouseCallback> = [];
const mouseEnterCallbacks : Array<MouseCallback> = [];
const mouseDownCallbacks  : Array<MouseCallback> = [];
const mouseUpCallbacks    : Array<MouseCallback> = [];
const wheelCallbacks      : Array<WheelCallback> = [];

const _input = {
	MOUSE_BUTTON,
	key: {
		down: (code: KeyCode): boolean => {
			if(keys[code]) return true;
			return false;
		},
	},
	mouse: {
		left: false,
		middle: false,
		right: false,
		back: false,
		forward: false,
		pos: {
			x: 0,
			y: 0,
		},
		down: (code: MOUSE_BUTTON): boolean => {
			if(buttons[code]) return true;
			return false;
		},
	},
	add_key_callback: (event: KeyInputName, callback: KeyCallback): void => {
		switch(event) {
			case "keydown":
				keyDownCallbacks.push(callback);
				break;
			case "keyup":
				keyUpCallbacks.push(callback);
				break;
		}
	},
	add_mouse_callback: (event: MouseInputName, callback: MouseCallback): void => {
		switch(event) {
			case "mousemove":
				mouseMoveCallbacks.push(callback);
				break;
			case "mouseenter":
				mouseEnterCallbacks.push(callback);
				break;
			case "buttondown":
				mouseDownCallbacks.push(callback);
				break;
			case "buttonup":
				mouseUpCallbacks.push(callback);
				break;
		}
	},
	add_wheel_callback: (callback: WheelCallback): void => {
		wheelCallbacks.push(callback);
	},
};

interface KeyPressedData {
	[key: string]: boolean;
}

export async function init(): Promise<void> {
	// KEYBOARD.
	window.addEventListener("keydown", on_key_down);
	window.addEventListener("keyup", on_key_up);

	// MOUSE.
	window.addEventListener("mousemove", on_mouse_move);
	window.addEventListener("mousedown", on_mouse_down);
	window.addEventListener("mouseup", on_mouse_up);
	window.addEventListener("mouseenter", on_mouse_enter);
	window.addEventListener("wheel", on_wheel);
}

let keyDownIndex: number;
const on_key_down = (evt: KeyboardEvent): void => {
	keys[evt.code] = true;
	for(keyDownIndex = 0; keyDownIndex < keyDownCallbacks.length; ++keyDownIndex)
		keyDownCallbacks[keyDownIndex](evt);
};

let keyUpIndex: number;
const on_key_up = (evt: KeyboardEvent): void => {
	keys[evt.code] = false;
	for(keyUpIndex = 0; keyUpIndex < keyUpCallbacks.length; ++keyUpIndex)
		keyUpCallbacks[keyUpIndex](evt);
};

let mouseMoveIndex: number;
const on_mouse_move = (evt: MouseEvent): void => {
	input.mouse.pos.x = evt.clientX;
	input.mouse.pos.y = evt.clientY;
	for(mouseMoveIndex = 0; mouseMoveIndex < mouseMoveCallbacks.length; ++mouseMoveIndex)
		mouseMoveCallbacks[mouseMoveIndex](evt);
};

let mouseDownIndex: number;
const on_mouse_down = (evt: MouseEvent): void => {
	buttons[evt.button] = true;
	moust_button_handler(evt.button, true);
	for(mouseDownIndex = 0; mouseDownIndex < mouseDownCallbacks.length; ++mouseDownIndex)
		mouseDownCallbacks[mouseDownIndex](evt);
};

let mouseUpIndex: number;
const on_mouse_up = (evt: MouseEvent): void => {
	buttons[evt.button] = false;
	moust_button_handler(evt.button, false);
	for(mouseUpIndex = 0; mouseUpIndex < mouseUpCallbacks.length; ++mouseUpIndex)
		mouseUpCallbacks[mouseUpIndex](evt);
};

let mouseEnterIndex: number;
const on_mouse_enter = (evt: MouseEvent): void => {
	on_mouse_move(evt);
	for(mouseEnterIndex = 0; mouseEnterIndex < mouseEnterCallbacks.length; ++mouseEnterIndex)
		mouseEnterCallbacks[mouseEnterIndex](evt);
};

let wheelIndex: number;
// https://stackoverflow.com/a/67308650
const on_wheel = (evt: WheelEvent): void => {
	for(wheelIndex = 0; wheelIndex < wheelCallbacks.length; ++wheelIndex)
		wheelCallbacks[wheelIndex](evt);
};

const moust_button_handler = (code: number, down: boolean): void => {
	switch(code) {
		case MOUSE_BUTTON.LEFT:
			_input.mouse.left = down;
			return;
		case MOUSE_BUTTON.MIDDLE:
			_input.mouse.middle = down;
			return;
		case MOUSE_BUTTON.RIGHT:
			_input.mouse.right = down;
			return;
		case MOUSE_BUTTON.BACK:
			_input.mouse.back = down;
			return;
		case MOUSE_BUTTON.FORWARD:
			_input.mouse.forward = down;
			return;
	}
};

declare global {
	var input: typeof _input;
}

globalThis.input = _input;

export {};