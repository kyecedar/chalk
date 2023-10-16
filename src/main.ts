//import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

import "./modules/logger";

import { register_button_listeners } from "./modules/window";
import { register_listeners } from "./modules/input";
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

window.addEventListener("DOMContentLoaded", () => {
    globalThis.testext = (document.getElementById("testext") as HTMLDivElement)!;
    appWindow.show();

    // TITLEBAR.
    register_button_listeners();

    // INPUT.
    register_listeners();

    //logger.info("shit");

    // BOARD VIEW.
    board.init();
    //@ts-ignore
    console.log(window.shit);
    //canvas.animate();

    // CONFIG.
    // input.add_wheel_callback((evt: WheelEvent) => {
    //   if(testext) testext.innerText = evt.deltaY.toString();
    // });

    // greetInputEl = document.querySelector("#greet-input");
    // greetMsgEl = document.querySelector("#greet-msg");
    // document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    //   e.preventDefault();
    //   greet();
    // });
});
