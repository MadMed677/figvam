import {Engine, Entity} from 'typed-ecstasy';
import {RenderSystem, MovementSystem, ObjectCreatorSystem} from '../systems';
import {PositionComponent, VelocityComponent} from '../components';

export const engine = new Engine();

// Adding systems
engine.systems.add(RenderSystem);
engine.systems.add(MovementSystem);
engine.systems.add(ObjectCreatorSystem);

// Adding entities
const entity1 = new Entity();
entity1.add(new PositionComponent(0, 0));
entity1.add(new VelocityComponent());

const entity2 = new Entity();
entity2.add(new PositionComponent(100, 100));
entity2.add(new VelocityComponent());

const entity3 = new Entity();
entity3.add(new PositionComponent(200, 200));

engine.entities.add(entity1);
engine.entities.add(entity2);
engine.entities.add(entity3);
