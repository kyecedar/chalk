// Prevents additional console window on Windows in release, DO NOT REMOVE!!
// ALRIGHT ALRIGHT JEEZ.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            main_window.eval("window.shit = 'shat';").unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
