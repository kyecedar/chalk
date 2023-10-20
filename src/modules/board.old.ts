let boardview : HTMLDivElement;
let scribbletransform : HTMLDivElement;
let scribbleview : HTMLDivElement;

let MAX_SCALE  : number = 5.00;
let MIN_SCALE  : number = 0.15;
let SCALE_STEP : number = 0.99;

const blocks : Array<HTMLDivElement> = [];

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

const BLOCK_COUNT = 1000;
const BLOCK_SPREAD = 2000;

let middle_mouse: boolean = false;

let x = 0;
let y = 0;

let scale_index : number = 4;

let scales = [
	5.00,
	4.00,
	3.00,
	2.00,
	
	1.00,

	0.80,
	0.60,
	0.40,
	0.20,
];

let prevScale: number;
let scale : number;

let offsetX : number = 0;
let offsetY : number = 0;

export function init() {
	boardview = (document.getElementById("board-view") as HTMLDivElement)!;
	scribbletransform = (document.getElementById("scribble-transform") as HTMLDivElement)!;
	scribbleview = (document.getElementById("scribble-view") as HTMLDivElement)!;

	for(let i = 0; i < BLOCK_COUNT; ++i) create_block(scribbleview);

	input.add_wheel_callback((evt: WheelEvent) => {
		prevScale = scales[scale_index];

		console.log("\n");

		console.log(evt.deltaY);

		if(evt.deltaY < 0) scale_index--;
		else if(evt.deltaY > 0) scale_index++;

		if(scale_index === scales.length || scale_index === -1) {
			scale_index = Math.max(Math.min(scale_index, scales.length - 1), 0);
			return;
		}

		scale = scales[scale_index];

		// scaleChanged = Math.pow(STEP, factor) // factor = evt.deltaY // STEP = 0.99
		// scale *= scaleChanged // apply it after, so it's a modification to the existing scale.
		// looks like we want to get something we multiply to the current scale to get the target scale.
		const scaleDelta = scale / prevScale;

		console.log(scaleDelta);

		// 
		const boardRect = boardview.getBoundingClientRect();
		const scribbleRect = scribbleview.getBoundingClientRect();
		console.log(boardRect);

		const originX = boardRect.x + boardRect.width / 2;
		const originY = boardRect.y + boardRect.height / 2;

		// offset of mouse from center of board.
		const inputOffsetX = (input.mouse.main_pos.x) - scribbleRect.width;
		const inputOffsetY = (input.mouse.main_pos.y) - scribbleRect.height;

		const newX = scribbleRect.x + inputOffsetX * (1 - scaleDelta);
		const newY = scribbleRect.y + inputOffsetY * (1 - scaleDelta);

		// scale the offset and get the difference, move in opposite direction with difference.
		const scaleOffsetX = inputOffsetX * scaleDelta;
		const scaleOffsetY = inputOffsetY * scaleDelta;

		//console.log(scaleOffsetX - inputOffsetX);

		//console.log((inputOffsetX - scaleOffsetX) * scaleDelta);

		offsetX = inputOffsetX - scaleOffsetX;
		offsetY = inputOffsetY - scaleOffsetY;
		//console.log(offsetX);
		//console.log("");
		//offsetY = inputOffsetY - scaleOffsetY;

		// TODO: might have to subtract origin from offset.

		//scribbleview.style.scale = scale.toString();
		scribbleview.style.transform = `translate(${Math.round(offsetX)}px, ${Math.round(offsetY)}px) scale(${scale})`;
		console.log(scribbleview.style.transform);
	});

	input.add_mouse_callback("buttondown", (evt: MouseEvent) => {
		if(evt.button === input.MOUSE_BUTTON.MIDDLE) middle_mouse = true;
	});

	input.add_mouse_callback("buttonup", (evt: MouseEvent) => {
		if(evt.button === input.MOUSE_BUTTON.MIDDLE) middle_mouse = false;
	});

	input.add_mouse_callback("mousemove", (evt: MouseEvent) => {
		if(middle_mouse) {
			x += evt.movementX;
			y += evt.movementY;
			set_position(x, y);
		}
	});

	loop();
};

function set_position(x: number, y: number) {
	scribbletransform.style.left = `${Math.round(x)}px`;
	scribbletransform.style.top = `${Math.round(y)}px`;
}

function create_block(parent: HTMLDivElement) {
	let div = document.createElement("div");

	div.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)] + "33";
	div.setAttribute("class", "test");
	//div.innerText = "bingus";
	div.style.top = (Math.round(Math.random() * BLOCK_SPREAD - (BLOCK_SPREAD / 2)) + "px");
	div.style.left = (Math.round(Math.random() * BLOCK_SPREAD - (BLOCK_SPREAD / 2)) + "px");

	blocks.push(div);
	parent.appendChild(div);
}

function loop() {
	requestAnimationFrame(loop);
	
	update();
	render();
}

function update() {
}

function render() {
}

export {};