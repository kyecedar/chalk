import { appWindow } from "@tauri-apps/api/window";

let taskbar: HTMLDivElement;
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

export async function register_button_listeners() {
	taskbar = (document.getElementById("window-titlebar") as HTMLDivElement)!;
	minimize_button = (document.querySelector("#window-titlebar .minimize") as HTMLButtonElement)!;
	maximize_button = (document.querySelector("#window-titlebar .maximize") as HTMLButtonElement)!;
	close_button = (document.querySelector("#window-titlebar .close") as HTMLButtonElement)!;

	minimize_button?.addEventListener("click", minimize_window);
	maximize_button?.addEventListener("click", maximize_window);
	close_button?.addEventListener("click", close_window);

	if(maximize_button)
		appWindow.onResized(update_maximize_attribute);
}