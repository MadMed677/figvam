use specs::{Builder, Component, System, VecStorage, World, WorldExt};
use wasm_bindgen::prelude::*;

#[derive(Component)]
#[storage(VecStorage)]
pub struct Position {
    pub x: f32,
    pub y: f32,
}

// pub trait IFigvamEngineBuilder {
//     // fn with_system(&mut self, system: dyn System) -> Box<Self>;
//     fn with_entity<'a>(&'a mut self) -> &'a mut Self;
// }

// #[wasm_bindgen]
pub struct FigvamEngineBuilder {
    world: World,
}

// #[wasm_bindgen]
impl FigvamEngineBuilder {
    // #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            world: World::new(),
        }
    }

    pub fn with_entity(self) -> Self {
        let mut this = self;

        this.world
            .create_entity()
            .with(Position { x: 0.0, y: 0.0 })
            .build();

        this
    }
}

// impl IFigvamEngineBuilder for FigvamEngineBuilder {
//     // fn with_system(&mut self, system: Box<dyn System>) -> Box<Self> {
//     //     self.world.
//     // }
//
//     fn with_entity<'a>(&'a mut self) -> &'a mut Self {
//         self.world
//             .create_entity()
//             .with(Position { x: 0.0, y: 0.0 })
//             .build();
//
//         self
//     }
// }

// #[wasm_bindgen]
pub struct FigvamEngine {}

// #[wasm_bindgen]
impl FigvamEngine {
    pub fn get_builder() -> FigvamEngineBuilder {
        FigvamEngineBuilder::new()
    }
}
