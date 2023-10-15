let boardview : HTMLDivElement;
let scale = 1.0;

let minscale = 0.01;
let maxscale = 10.0;

let scalevel = 0.03;

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

const BLOCK_COUNT = 4450;
const BLOCK_SPREAD = 5000;
const OUTLINE_MIN = 2.0;
const OUTLINE_MAX_SCALE = 0.5;
const OUTLINE_MAX_WIDTH = 10;

export function init() {
	boardview = (document.getElementById("board-view") as HTMLDivElement)!;

	boardview.style.top = "50%";
	boardview.style.left = "50%";

	for(let i = 0; i < BLOCK_COUNT; ++i) {
		create_block(boardview);
	}

	loop();
};

function create_block(parent: HTMLDivElement) {
	let div = document.createElement("div");

	div.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)] + "33";
	div.style.position = "absolute";
	div.style.width = "10px";
	div.style.height = "10px";
	div.style.outlineColor = "#000000cc";
	div.style.outlineWidth = "0px";
	div.style.outlineStyle = "solid";
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
	if(scale > maxscale || scale < minscale) scalevel = -scalevel;
	scale += scalevel;
	boardview.style.scale = scale.toString();
	//console.log(Math.random());
	//console.log(scale);
}

function render() {
}

export {};