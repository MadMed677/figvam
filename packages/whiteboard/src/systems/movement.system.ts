import {Service} from 'typedi';
import {Entity, EntitySystem, Family} from 'typed-ecstasy';

import {DragComponent, PositionComponent} from '../components';

@Service()
export class MovementSystem extends EntitySystem {
    private entities: Entity[] = [];

    protected override onEnable(): void {
        this.entities = this.engine.entities.forFamily(
            Family.all(PositionComponent, DragComponent).get(),
        );
    }

    protected override onDisable(): void {
        this.entities = [];
    }

    update(): void {
        for (const entity of this.entities) {
            const position = entity.require(PositionComponent);
            const drag = entity.require(DragComponent);

            position.x = drag.x;
            position.y = drag.y;
        }
    }
}
