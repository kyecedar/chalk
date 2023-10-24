//#region // 󰫧 VARIABLES.

let elemBoard     : HTMLDivElement;
let elemCenterer  : HTMLDivElement;
let elemTransform : HTMLDivElement;
let elemContent   : HTMLDivElement;

let zoomMin          : number = 0.20;
let zoomMax          : number = 5.00;
let zoomTowardsDelta : number = 1.00;
let zoomAwayDelta    : number = 0.20;
let zoomIndex        : number = 0; // positive for zoom in, negative for zoom out.

let position : Vector = new Vector();

//#endregion 󰫧 VARIABLES.

const _board = {
	settings: {
	},

	/**
	 * Teleports user view to location.
	 * @param x 
	 * @param y 
	 */
	teleport: (x: number, y: number): void => {
		set_position(x, y);
	},

	hovered: (): boolean => {
		return elemBoard.matches(":hover");
	},

	get_zoom_index_min: (): number => {
		return Math.floor((1 - zoomMin) / -zoomAwayDelta);
	},
	get_zoom_index_max: (): number => {
		return Math.max(Math.ceil(zoomMax / zoomTowardsDelta) - 1, 0);
	},
	
	set_zoom_min: (value: number): void => {
		zoomMin = value;
		elemBoard.style.setProperty("--zoom-min", zoomMin.toString());
	},
	set_zoom_max: (value: number): void => {
		zoomMax = value;
		elemBoard.style.setProperty("--zoom-max", zoomMax.toString());
	},
	set_zoom_index: (value: number): void => {
		zoomIndex = (value < 0) ? 
			Math.max(value, _board.get_zoom_index_min()) : 
			Math.min(value, _board.get_zoom_index_max());
		elemBoard.style.setProperty("--zoom-index", zoomIndex.toString());
	},
	set_zoom_towards_delta: (value: number): void => {
		zoomTowardsDelta = value;
		elemBoard.style.setProperty("--zoom-towards-delta", zoomTowardsDelta.toString());
	},
	set_zoom_away_delta: (value: number): void => {
		zoomAwayDelta = value;
		elemBoard.style.setProperty("--zoom-away-delta", zoomAwayDelta.toString());
	},
};

//#region // 󰙨 TESTING.

const BLOCK_SPREAD = 1000;
const BLOCK_COUNT = 2000;

const COLORS : Array<string> = [
	"#ca563e",
	"#e8864e",
	"#f1ba8e",
	"#ecd999",
	"#f1f0d9",
	"#a5dbd0",
	"#94c1ba",
	"#4ea9c1",
	"#373b42",
	"#847b8f",
	"#6d423e",
	"#8f6540",
	"#aa8537",
	"#e7b550",
	"#a4ad67",
	"#649451",
	"#3e6b5a",
	"#232323",
];

function create_block(parent: HTMLDivElement) {
	let div = document.createElement("div");
	
	div.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)] + "FF";
	div.setAttribute("class", "test");
	//div.innerText = "bingus";
	div.style.top = (Math.round(Math.random() * BLOCK_SPREAD - (BLOCK_SPREAD / 2)) + "px");
	div.style.left = (Math.round(Math.random() * BLOCK_SPREAD - (BLOCK_SPREAD / 2)) + "px");
	
	parent.appendChild(div);
}

//#endregion 󰙨 TESTING.

export function init(): void {
	// ELEMENTS.
	elemBoard = (document.getElementById("board") as HTMLDivElement)!;
	elemCenterer = (document.querySelector("#board > .centerer") as HTMLDivElement)!;
	elemTransform = (document.getElementById("board-transform") as HTMLDivElement)!;
	elemContent = (document.getElementById("board-content") as HTMLDivElement)!;

	for(let i = 0; i < BLOCK_COUNT; ++i) create_block(elemContent);

	// LISTENERS.
	elemBoard.addEventListener("resize", on_window_resize);
	input.add_wheel_callback(on_zoom);
	input.add_mouse_callback("mousemove", on_drag);
	
	// DEFAULTS.
	_board.set_zoom_min(zoomMin);
	_board.set_zoom_max(zoomMax);
	_board.set_zoom_index(zoomIndex);
	_board.set_zoom_towards_delta(zoomTowardsDelta);
	_board.set_zoom_away_delta(zoomAwayDelta);

	on_window_resize();
}

//#region // 󱐋 EVENTS.

const on_window_resize = (_evt?: UIEvent): void => {
};

let _deltaY    : -1 | 1;
let _cRect     : DOMRect; // content rect.
const _mOffset : Vector = new Vector(); // mouse offset.
function on_zoom(evt: WheelEvent): void {
	if(evt.deltaY > 0) _deltaY = -1;
	else if(evt.deltaY < 0) _deltaY = 1;
	else return;

	_cRect = elemContent.getBoundingClientRect();

	// subtract centerer position to mouse to get mouse offset from center.
	_mOffset.x = input.mouse.pos.x - _cRect.x;
	_mOffset.y = input.mouse.pos.y - _cRect.y;

	set_zoom(get_zoom(zoomIndex + _deltaY), _mOffset.x, _mOffset.y);
}

function on_drag(evt: MouseEvent): void {
	if(input.mouse.middle) {
		position.x += evt.movementX
		position.y += evt.movementY;
		set_position(position);
	}
}

//#endregion 󱐋 EVENTS.

//#region // 󰁌 ZOOM & POSITION.

/**
 * Get processed zoom value from index multiplied by "away" or "towards" deltas.
 * @returns Processed zoom value.
 * @param index Get zoom value of.
 */
const get_zoom = (index: number = zoomIndex): number => {
	return (index < 0) ? 
		Math.max(1 - (index * -1) * zoomAwayDelta, zoomMin) : 
		Math.min((index + 1) * zoomTowardsDelta, zoomMax);
};

const get_zoom_index = (zoom?: number): number => {
	if(zoom === undefined) return zoomIndex;

	return (zoom < 1) ? 
		Math.round((1 - zoom) / -zoomAwayDelta) : 
		Math.round(zoom / zoomTowardsDelta - 1);
};

let _zoomChange : number;
const _zOffset  : Vector = new Vector(); // zoomed mouse offset.
/**
 * Zooms board.
 * @param zoom 
 * @param x Offset from center.
 * @param y Offset from center.
 */
const set_zoom = (zoom: number, x: number = 0, y: number = 0): void => {
	// SUMMARY: keep distance relative to position while scaling.

	zoom = Math.min(Math.max(get_zoom(get_zoom_index(zoom)), zoomMin), zoomMax);
	if(zoom == get_zoom()) return;

	_zoomChange = zoom / get_zoom();

	_zOffset.x += x - (x * _zoomChange);
	_zOffset.y += y - (y * _zoomChange);

	// add offset onto position.
	_board.set_zoom_index(get_zoom_index(zoom));
	// gotta use round or else it'll anti-alias.
	elemContent.style.transform = `translate(${Math.round(_zOffset.x)}px, ${Math.round(_zOffset.y)}px) scale(${zoom})`;
};

function get_position(x: number, y: number): Position;
function get_position(vec: Vector): Position;
function get_position(pos: Position): Position;
/**
 * Get processed position by multiplying it by scale.
 * @returns Processed position.
 */
function get_position(x: number | Vector | Position, y?: number): Position {
	if(x instanceof Vector || typeof(x) === "object") {
		return {
			x: x.x * get_zoom(),
			y: x.y * get_zoom(),
		}
	}

	return {
		x: x * get_zoom(),
		y: y! * get_zoom(),
	};
}

function set_position(x: number, y: number): void;
function set_position(vec: Vector): void;
function set_position(pos: Position): void;
/**
 * Sets view position on board.
 * @param x Absolute value, not affected by scale.
 * @param y Absolute value, not affected by scale.
 */
function set_position(x: number | Vector | Position, y?: number): void {
	if(x instanceof Vector || typeof(x) === "object") {
		elemTransform.style.left = `${Math.round(x.x)}px`;
		elemTransform.style.top  = `${Math.round(x.y)}px`;
		return;
	}
	
	elemTransform.style.left = `${Math.round(x)}px`;
	elemTransform.style.top  = `${Math.round(y!)}px`;
}

//#endregion 󰁌 ZOOM & POSITION.

declare global {
	var board: typeof _board;
}

globalThis.board = _board;

export {};