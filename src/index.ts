import '@abraham/reflection';
import {Entity} from 'typed-ecstasy';

import {FigvamEngine} from './core/figvam.engine';
import {FpsService} from './services';
import {MovementSystem, ObjectCreatorSystem, RenderSystem} from './systems';
import {PositionComponent, VelocityComponent} from './components';

const engine = FigvamEngine.getBuilder()
    .withSystem(RenderSystem)
    .withSystem(MovementSystem)
    .withSystem(ObjectCreatorSystem)
    .withEntity(
        (() => {
            const entity = new Entity();
            entity.add(new PositionComponent(0, 0));
            entity.add(new VelocityComponent());

            return entity;
        })(),
    )
    .withEntity(
        (() => {
            const entity = new Entity();
            entity.add(new PositionComponent(100, 100));
            entity.add(new VelocityComponent());

            return entity;
        })(),
    )
    .withEntity(
        (() => {
            const entity = new Entity();
            entity.add(new PositionComponent(200, 200));

            return entity;
        })(),
    )
    .build();

const fpsService = new FpsService(1, time => {
    engine.update(time);
});

fpsService.start();
