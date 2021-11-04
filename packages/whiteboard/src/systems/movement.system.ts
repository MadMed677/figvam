import {Inject, Service} from 'typedi';
import {Entity, EntitySystem} from 'typed-ecstasy';

import {PositionComponent} from '../components';
import {EventBusService, IMoveEntities} from '../services';
import {SignalConnections} from 'typed-signals';

@Service()
export class MovementSystem extends EntitySystem {
    @Inject()
    private readonly eventBusService!: EventBusService;
    private readonly connections = new SignalConnections();

    protected override onEnable(): void {
        this.connections.add(
            this.eventBusService.moveEntities.connect(
                this.moveEntities.bind(this),
            ),
        );
    }

    protected override onDisable(): void {
        this.connections.disconnectAll();
    }

    private moveEntities(entities: Entity[], options: IMoveEntities): void {
        for (const entity of entities) {
            const position = entity.require(PositionComponent);

            position.x += options.position.dx;
            position.y += options.position.dy;
        }
    }

    update(): void {}
}
