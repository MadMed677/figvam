use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct SizeComponent {
    pub width: u16,
    pub height: u16,
}
