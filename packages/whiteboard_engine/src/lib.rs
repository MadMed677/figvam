mod legion_engine;
mod specs_engine;
mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn greet() -> String {
    "Hello, whiteboard-engine! With updates!".into()
}

#[wasm_bindgen]
pub fn create_specs_engine() {
    let _ = specs_engine::FigvamEngine::get_builder().with_entity();
}

#[wasm_bindgen]
pub fn create_legion_engine() -> legion_engine::FigvamEngineBuilder {
    let engine = legion_engine::FigvamEngine::get_builder().with_entity();

    engine
}
