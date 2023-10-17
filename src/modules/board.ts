let boardview : HTMLDivElement;
let scribbletransform : HTMLDivElement;
let scribbleview : HTMLDivElement;
let scale_index : number = 4;

let scales : Array<number> = [
	5.00,
	3.00,
	2.00,
	1.50,

	1.00,
	
	0.75,
	0.50,
	0.25,
	0.15,
];

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

export function init() {
	boardview = (document.getElementById("board-view") as HTMLDivElement)!;
	scribbletransform = (document.getElementById("scribble-transform") as HTMLDivElement)!;
	scribbleview = (document.getElementById("scribble-view") as HTMLDivElement)!;

	for(let i = 0; i < BLOCK_COUNT; ++i) {
		create_block(scribbleview);
	}

	testext.innerText = scales[scale_index].toString();

	input.add_wheel_callback((evt: WheelEvent) => {
		if(evt.deltaY < 0) scale_index--;
		else if(evt.deltaY > 1) scale_index++;
		
		// clamp scale index.
		scale_index = Math.min(Math.max(scale_index, 0), scales.length - 1);

		testext.innerText = scales[scale_index].toString();
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
			scribbletransform.style.left = `${x}px`;
			scribbletransform.style.top = `${y}px`;
		}
	});

	loop();
};

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
	scribbleview.style.scale = scales[scale_index].toString();
}

function render() {
}

export {};