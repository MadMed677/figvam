mod components;
mod graphics;
// mod legion_engine;
mod systems;
mod utils;
mod bevy_engine;

use wasm_bindgen::prelude::*;

use graphics::graphics_trait::IGraphics;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    type Bar;

    #[wasm_bindgen(constructor)]
    fn new(arg: i32) -> Bar;

    #[wasm_bindgen(js_namespace = Bar)]
    fn another_function() -> i32;

    #[wasm_bindgen(method)]
    fn get(this: &Bar) -> i32;

    #[wasm_bindgen(method)]
    fn set(this: &Bar, val: i32);

    #[wasm_bindgen(method, getter)]
    fn property(this: &Bar) -> i32;

    #[wasm_bindgen(method, setter)]
    fn set_property(this: &Bar, val: i32);
}

#[wasm_bindgen]
struct FigvamFactory {
    graphics: Vec<Box<dyn IGraphics<u32>>>,
}

#[wasm_bindgen]
impl FigvamFactory {
    // pub fn create() -> legion_engine::FigvamEngineCreator {
    //     let engine = legion_engine::FigvamEngine::get_builder()
    //         .with_entity()
    //         .with_entity()
    //         .with_system()
    //         .build();
    //
    //     engine
    // }
    pub fn create() -> bevy_engine::FigvamEngineBuilder {
        let engine = bevy_engine::FigvamEngine::get_builder()
            .build();

        engine
    }
}
