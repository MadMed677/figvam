use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, PartialEq, Serialize, Deserialize, Debug)]
pub struct PositionComponent {
    pub x: f32,
    pub y: f32,
}
