//import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

import "./modules/logger";

import { add_button_event_listeners } from "./modules/window";
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

window.addEventListener("DOMContentLoaded", () => {
  appWindow.show();

  // TITLEBAR.
  add_button_event_listeners();

  logger.info("shit");

  // BOARD VIEW.
  board.init();
  //canvas.animate();

  // greetInputEl = document.querySelector("#greet-input");
  // greetMsgEl = document.querySelector("#greet-msg");
  // document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   greet();
  // });
});
