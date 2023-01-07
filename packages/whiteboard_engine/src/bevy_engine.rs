use bevy_ecs::prelude::*;
use wasm_bindgen::prelude::*;
use crate::components::PositionComponent;

#[wasm_bindgen]
pub struct FigvamEngineBuilder {
	world: World
}

#[wasm_bindgen]
pub struct FigvamEngineCreator {}

#[wasm_bindgen]
pub struct WithEntityOptions {
	pub position: PositionComponent
}

#[wasm_bindgen]
impl WithEntityOptions {
	#[wasm_bindgen(constructor)]
	pub fn new(position: PositionComponent) -> Self {
		Self {
			position
		}
	}
}

#[wasm_bindgen]
impl FigvamEngineBuilder {
	pub fn new() -> Self {
		Self {
			world: World::default()
		}
	}

	pub fn with_entity(self, options: Option<WithEntityOptions>) -> Self {
		let mut this = self;

		let options = options.unwrap_or(WithEntityOptions {
			position: PositionComponent {
				x: 0.0,
				y: 0.0
			}
		});

		this.world.spawn().insert(options.position);

		this
	}

	pub fn get_all(&self) {
	}

	pub fn build(self) -> Self {
		self
	}
}

pub struct FigvamEngine {}

impl FigvamEngine {
	pub fn get_builder() -> FigvamEngineBuilder { FigvamEngineBuilder::new() }
}
