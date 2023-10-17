import { appWindow } from "@tauri-apps/api/window";

let taskbar: HTMLDivElement;
let taskbar_title: HTMLSpanElement;
let minimize_button: HTMLButtonElement;
let maximize_button: HTMLButtonElement;
let close_button: HTMLButtonElement;

async function minimize_window() {
	appWindow.minimize();
}

async function update_maximize_attribute() {
	if(await appWindow.isMaximized()) taskbar?.setAttribute("maximized", "");
	else taskbar?.removeAttribute("maximized");
}

async function maximize_window() {
	appWindow.toggleMaximize();
}

async function close_window() {
	// TODO: show warning if needed.

	appWindow.hide(); // hide window for quick-lookin close.

	// TODO: save everything first.

	appWindow.close();
}

export async function init() {
	taskbar = (document.getElementById("window-titlebar") as HTMLDivElement)!;
	taskbar_title = (document.getElementById("window-title") as HTMLSpanElement)!;
	minimize_button = (document.querySelector("#window-titlebar .minimize") as HTMLButtonElement)!;
	maximize_button = (document.querySelector("#window-titlebar .maximize") as HTMLButtonElement)!;
	close_button = (document.querySelector("#window-titlebar .close") as HTMLButtonElement)!;

	register_button_listeners();
}

async function register_button_listeners() {
	minimize_button?.addEventListener("click", minimize_window);
	maximize_button?.addEventListener("click", maximize_window);
	close_button?.addEventListener("click", close_window);

	if(maximize_button)
		appWindow.onResized(update_maximize_attribute);
}

export async function set_title(title: string) {
	taskbar_title.innerText = title;
	await appWindow.setTitle(title);
}