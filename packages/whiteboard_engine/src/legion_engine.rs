use legion::*;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Position {
    x: f32,
    y: f32,
}

#[derive(Clone, Copy, PartialEq)]
pub struct Velocity {
    dx: f32,
    dy: f32,
}

#[wasm_bindgen]
pub struct FigvamEngineBuilder {
    world: World,
}

#[wasm_bindgen]
impl FigvamEngineBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            world: World::default(),
        }
    }

    pub fn with_entity(self) -> Self {
        let mut this = self;

        // Creating new Entity
        this.world.push((
            Position { x: 10.0, y: 20.0 },
            Velocity {
                dx: 100.0,
                dy: 100.0,
            },
        ));

        this
    }

    pub fn entities(&self) -> JsValue {
        let mut query = <&Position>::query();

        let mut entities = Vec::new();
        for position in query.iter(&self.world) {
            entities.push(position.clone());
        }

        JsValue::from_serde(&entities).unwrap()
    }
}

// #[wasm_bindgen]
pub struct FigvamEngine {}

// #[wasm_bindgen]
impl FigvamEngine {
    pub fn get_builder() -> FigvamEngineBuilder {
        FigvamEngineBuilder::new()
    }
}
