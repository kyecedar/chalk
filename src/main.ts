//import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

import "./modules/logger";

import * as win from "./modules/window";
import * as input from "./modules/input";
import * as board from "./modules/board";

// let greetInputEl: HTMLInputElement | null;
// let greetMsgEl: HTMLElement | null;

// async function greet() {
  // if(!(greetMsgEl && greetInputEl)) return;
  
  // // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // greetMsgEl.textContent = await invoke("greet", {
  //   name: greetInputEl.value,
  // });
// }

declare global {
    var testext: HTMLDivElement;
}

let loading: HTMLDivElement;

window.addEventListener("DOMContentLoaded", () => {
    globalThis.testext = (document.getElementById("testext") as HTMLDivElement)!;
    loading = (document.getElementById("loading-view") as HTMLDivElement)!;
    appWindow.show();

    // TITLEBAR.
    win.init();

    win.set_title("chalk. test");

    // INPUT.
    input.init();

    //logger.info("shit");

    // BOARD VIEW.
    board.init();
    //canvas.animate();

    // CONFIG.
    // input.add_wheel_callback((evt: WheelEvent) => {
    //   if(testext) testext.innerText = evt.deltaY.toString();
    // });

    loading.removeAttribute("loading");

    // greetInputEl = document.querySelector("#greet-input");
    // greetMsgEl = document.querySelector("#greet-msg");
    // document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    //   e.preventDefault();
    //   greet();
    // });
});
