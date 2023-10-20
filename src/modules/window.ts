import { appWindow } from "@tauri-apps/api/window";

let elemTaskbar  : HTMLDivElement;
let elemTitle    : HTMLSpanElement;
let elemMinimize : HTMLButtonElement;
let elemMaximize : HTMLButtonElement;
let elemClose    : HTMLButtonElement;

const _win = {
	minimize: async (): Promise<void> => {
		return minimize_window();
	},
	maximize: (): Promise<void> => {
		return maximize_window();
	},
	close: (): Promise<void> => {
		return close_window();
	},

	set_title: async (value: string): Promise<void> => {
		elemTitle.innerText = value;
		return appWindow.setTitle(value);
	},
};

export async function init() {
	elemTaskbar  = (document.getElementById("window-titlebar") as HTMLDivElement)!;
	elemTitle    = (document.getElementById("window-title") as HTMLSpanElement)!;
	elemMinimize = (document.querySelector("#window-titlebar .minimize") as HTMLButtonElement)!;
	elemMaximize = (document.querySelector("#window-titlebar .maximize") as HTMLButtonElement)!;
	elemClose    = (document.querySelector("#window-titlebar .close") as HTMLButtonElement)!;

	register_button_listeners();
}

async function register_button_listeners() {
	elemMinimize.addEventListener("click", minimize_window);
	elemMaximize.addEventListener("click", maximize_window);
	elemClose.addEventListener("click", close_window);
	
	appWindow.onResized(update_maximize_attribute);
}

async function minimize_window(): Promise<void> {
	return appWindow.minimize();
}

async function update_maximize_attribute() {
	if(await appWindow.isMaximized()) elemTaskbar?.setAttribute("maximized", "");
	else elemTaskbar?.removeAttribute("maximized");
}

async function maximize_window(): Promise<void> {
	return appWindow.toggleMaximize();
}

async function close_window(): Promise<void> {
	// TODO: show warning if needed.

	await appWindow.hide(); // hide window for quick-lookin close.

	// TODO: save everything first.

	return appWindow.close();
}

declare global {
	var win: typeof _win;
}

globalThis.win = _win;

export {};