mod legion_engine;
mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
struct FigvamFactory {}

#[wasm_bindgen]
impl FigvamFactory {
    pub fn create() -> legion_engine::FigvamEngineCreator {
        let engine = legion_engine::FigvamEngine::get_builder()
            .with_entity()
            .with_entity()
            .build();

        engine
    }
}
