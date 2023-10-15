import { appWindow } from "@tauri-apps/api/window";

let minimize_button: Element | null;
let maximize_button: Element | null;
let close_button: Element | null;

async function minimize_window() {
	appWindow.minimize();
}

async function update_maximize_attribute() {
	if(await appWindow.isMaximized()) maximize_button!.setAttribute("maximized", "");
	else maximize_button!.removeAttribute("maximized");
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

export async function add_button_event_listeners() {
	minimize_button = document.querySelector("#window-titlebar .minimize");
	maximize_button = document.querySelector("#window-titlebar .maximize");
	close_button = document.querySelector("#window-titlebar .close");

	minimize_button?.addEventListener("click", minimize_window);
	maximize_button?.addEventListener("click", maximize_window);
	close_button?.addEventListener("click", close_window);

	if(maximize_button)
		appWindow.onResized(update_maximize_attribute);
}