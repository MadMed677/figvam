import {MovementSystem} from './';
import {FigvamEngine} from '../core/figvam.engine';
import {DragComponent, PositionComponent} from '../components';
import {Engine} from 'typed-ecstasy';

describe('MovementSystem', () => {
    test('should change "PositionComponent" when "DragComponent" provide new "x" and "y"', () => {
        const engine = FigvamEngine.getBuilder()
            .withSystem(MovementSystem)
            .withEntity(entity => {
                entity.add(new PositionComponent(0, 0));
                entity.add(new DragComponent(10, 20));
            })
            .build();

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
                entity.add(new DragComponent(10, 20));
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
