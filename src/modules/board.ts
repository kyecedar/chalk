let elemBoard       : HTMLDivElement;
let elemCenterer    : HTMLDivElement;
let elemTranslation : HTMLDivElement;
let elemZoom        : HTMLDivElement;

let zoomMin          : number = 0.20;
let zoomMax          : number = 5.50;
let zoomTowardsDelta : number = 1.00;
let zoomAwayDelta    : number = 0.20;
let zoomIndex        : number = 0; // positive for zoom in, negative for zoom out.

let x : number = 0;
let y : number = 0;

const _board = {
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
		return Math.ceil((1 - zoomMin) / zoomAwayDelta);
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

export function init(): void {
	// ELEMENTS.
	elemBoard = (document.getElementById("board") as HTMLDivElement)!;
	elemCenterer = (document.querySelector("#board > .centerer") as HTMLDivElement)!;
	elemTranslation = (document.getElementById("scribble-translation") as HTMLDivElement)!;
	elemZoom = (document.getElementById("scribble-zoom") as HTMLDivElement)!;

	// LISTENERS.
	input.add_wheel_callback(on_zoom);
	input.add_mouse_callback("mousemove", on_drag);

	// DEFAULTS.
	_board.set_zoom_min(zoomMin);
	_board.set_zoom_max(zoomMax);
	_board.set_zoom_index(zoomIndex);
	_board.set_zoom_towards_delta(zoomTowardsDelta);
	_board.set_zoom_away_delta(zoomAwayDelta);

	console.log(_board.get_zoom_index_max());
}

function on_zoom(evt: WheelEvent): void {
	// TODO:
	//     get scale change.
	//     get position delta.
	//     add position delta to current position.
	//     set scribble scale.

	// subtract centerer position to mouse to get mouse offset from center.
	elemCenterer.getBoundingClientRect().x;
}

function on_drag(evt: MouseEvent): void {
	if(input.mouse.middle) {
		x += evt.movementX;
		y += evt.movementY;
		set_position(x, y);
	}
}

/**
 * Get processed zoom value from index multiplied by "away" or "towards" deltas.
 * @returns Processed zoom value.
 */
const get_zoom = (): number => {
	return (zoomIndex < 0) ? Math.max(1 - (zoomIndex * -1) * zoomAwayDelta, zoomMin) : Math.min((zoomIndex + 1) * zoomTowardsDelta, zoomMax);
};

/**
 * Zooms board.
 * @param zoom 
 * @param x Offset from center.
 * @param y Offset from center.
 */
const set_zoom = (zoom: number, x: number = 0, y: number = 0): void => {

};

/**
 * Get processed position by multiplying it by scale.
 * @returns Processed position.
 */
const get_position = (x: number, y: number): Position => {
	return {
		x: x * get_zoom(),
		y: y * get_zoom(),
	};
};

/**
 * Sets view position on board.
 * @param x Absolute value, not affected by scale.
 * @param y Absolute value, not affected by scale.
 */
const set_position = (x: number, y: number): void => {
	elemTranslation.style.left = `${x}px`;
	elemTranslation.style.top  = `${y}px`;
};

declare global {
	var board: typeof _board;
}

globalThis.board = _board;

export {};