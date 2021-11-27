pub trait IGraphics {
    fn visual(self);
    fn should_component_update(&self) -> bool;
    fn set_props(&self);
    fn render(&self);
    fn destroy(&self);
}

pub struct GraphicsComponent {
    pub graphics: Box<dyn IGraphics>,
}
