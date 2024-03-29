//import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

import "./modules/util";
import "./modules/logger";

import * as modInput from "./modules/input";
import * as modWindow from "./modules/window";
import * as modBoard from "./modules/board";

// async function greet() {
	// if(!(greetMsgEl && greetInputEl)) return;
	
	// // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
	// greetMsgEl.textContent = await invoke("greet", {
	//   name: greetInputEl.value,
	// });
// }

declare global {
	var elemRoot: HTMLHtmlElement;
}

window.addEventListener("DOMContentLoaded", () => {
	globalThis.elemRoot = (document.querySelector(":root") as HTMLHtmlElement)!;
	appWindow.show();

	// prevent refresh.
	// https://github.com/tauri-apps/tauri/issues/7418
	// https://github.com/tauri-apps/tauri/discussions/3844
	// https://stackoverflow.com/questions/3527041/prevent-any-form-of-page-refresh-using-jquery-javascript
	// https://stackoverflow.com/questions/2482059/disable-f5-and-browser-refresh-using-javascript
	// https://stackoverflow.com/a/29847416
	// 😀 ghah yeah ig.
	document.onkeydown = (evt: KeyboardEvent): void => {
		if(evt.code === "F5") return evt.preventDefault();
		if(evt.ctrlKey && evt.code === "KeyR") return evt.preventDefault();
	};

	// prevents right click menu.
	document.oncontextmenu = (_evt?: MouseEvent): boolean => {
		return false;
	};

	// TITLEBAR.
	modWindow.init();

	win.set_title("chalk. test");

	// INPUT.
	modInput.init();

	// BOARD VIEW.
	modBoard.init();

	// DONE.
	elemRoot.removeAttribute("loading");
});
