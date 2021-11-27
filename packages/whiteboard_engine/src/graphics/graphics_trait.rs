pub trait IGraphics<T> {
    fn visual(&self);
    fn should_component_update(&self, next_props: T) -> bool;
    fn set_props(&self, props: T);
    fn destroy(&self);
}
