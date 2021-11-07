import {MovementSystem} from './';
import {FigvamEngine} from '../core/figvam.engine';
import {PositionComponent} from '../components';
import {EventBusService} from '../services';

describe('MovementSystem', () => {
    test('should change "PositionComponent" when Event Bus triggers "moveEntities" signal', () => {
        const engine = FigvamEngine.getBuilder()
            .withSystem(MovementSystem)
            .withEntity(entity => {
                entity.add(new PositionComponent(0, 0));
            })
            .build();

        const eventBus = engine.getContainer().get(EventBusService);
        eventBus.moveEntities.emit(engine.entities.getAll(), {
            position: {
                dx: 10,
                dy: 20,
            },
        });

        engine.update(0.16);

        engine.entities.getAll().forEach(entity => {
            const position = entity.require(PositionComponent);

            expect(position).toEqual({
                x: 10,
                y: 20,
            });
        });
    });

    test('should disable MovementSystem when enhine.systems.remove(MovementSystem) is called', () => {
        const engine = FigvamEngine.getBuilder()
            .withSystem(MovementSystem)
            .withEntity(entity => {
                entity.add(new PositionComponent(0, 0));
            })
            .build();

        // Unregister the MovementSystem
        engine.systems.remove(MovementSystem);

        // It shouldn't affect MovementSystem because we already unregistered it
        engine.update(0.16);

        engine.entities.getAll().forEach(entity => {
            const position = entity.require(PositionComponent);

            expect(position).toEqual({
                x: 0,
                y: 0,
            });
        });
    });
});
