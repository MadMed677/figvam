import {Service} from 'typedi';
import {Entity, EntitySystem, Family} from 'typed-ecstasy';

import {VelocityComponent, PositionComponent} from '../components';

@Service()
export class MovementSystem extends EntitySystem {
    private entities: Entity[] = [];

    protected override onEnable(): void {
        this.entities = this.engine.entities.forFamily(
            Family.all(PositionComponent, VelocityComponent).get(),
        );
    }

    protected override onDisable(): void {
        this.entities = [];
    }

    update(deltaTime: number): void {
        for (const entity of this.entities) {
            const position = entity.require(PositionComponent);
            const velocity = entity.require(VelocityComponent);

            position.x += velocity.x * deltaTime;
            position.y += velocity.y * deltaTime;
        }
    }
}
