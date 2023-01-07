use bevy_ecs::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Component, Clone, Copy, PartialEq, Debug)]
pub struct PositionComponent {
    pub x: f32,
    pub y: f32,
}

#[wasm_bindgen]
impl PositionComponent {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f32, y: f32) -> Self {
        Self {
            x,y
        }
    }
}
