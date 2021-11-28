use legion::*;
use wasm_bindgen::prelude::*;

use crate::components::{
    GraphicsComponent, PhysicsComponent, PositionComponent, SelectableComponent, SizeComponent,
};

#[system(for_each)]
fn my_for_each(position: &PositionComponent, size: &SizeComponent) {}

#[wasm_bindgen]
pub struct FigvamEngineBuilder {
    world: World,
    // schedule: legion::Schedule,
}

#[wasm_bindgen]
pub struct FigvamEngineCreator {}

pub trait IEntity {
    fn position() -> (f32, f32);
}

#[wasm_bindgen]
impl FigvamEngineBuilder {
    pub fn new() -> Self {
        Self {
            world: World::default(),
            // schedule: Schedule::builder(),
        }
    }

    pub fn with_entity(self) -> Self {
        let mut this = self;

        // Creating new Entity
        this.world.push((
            SelectableComponent,
            PhysicsComponent,
            PositionComponent { x: 10.0, y: 20.0 },
            SizeComponent {
                width: 100,
                height: 150,
            },
        ));

        this
    }

    pub fn with_system(self) -> Self {
        let mut this = self;

        let mut schedule = Schedule::builder()
            .add_system(my_for_each_system())
            // .add_system(render_system_system())
            .build();
        let mut resources = Resources::default();

        schedule.execute(&mut this.world, &mut resources);

        this
    }

    pub fn build(self) -> FigvamEngineCreator {
        FigvamEngineCreator {}
    }

    pub fn entities(&self) -> JsValue {
        let mut query = <&PositionComponent>::query();

        let mut entities = Vec::new();
        for position in query.iter(&self.world) {
            entities.push(position.clone());
        }

        JsValue::from_serde(&entities).unwrap()
    }
}

pub struct FigvamEngine {}

impl FigvamEngine {
    pub fn get_builder() -> FigvamEngineBuilder {
        FigvamEngineBuilder::new()
    }
}
