import {Inject, Service} from 'typedi';
import {Entity, EntitySystem, Family} from 'typed-ecstasy';

import {SelectedComponent} from '../components';
import {MouseSystem} from './mouse.system';
import {EventBusService} from '../services';
import {SignalConnections} from 'typed-signals';

@Service()
export class EntityDeselectorSystem extends EntitySystem {
    @Inject()
    mouseSystem!: MouseSystem;

    @Inject()
    eventBusService!: EventBusService;

    private readonly connections = new SignalConnections();
    private entities: Entity[] = [];
    private deselectObjects = false;
    private deselectionObjectsQueue: Entity[] = [];

    protected override onEnable(): void {
        this.entities = this.engine.entities.forFamily(
            Family.all(SelectedComponent).get(),
        );

        /**
         * @todo Should be reworked to avoid specific business logic listening
         *
         * We should know nothing about spawning. Perhaps the main idea
         *  were more correct before when we're listening click events
         *  on the canvas. But now to avoid specific `Mouse` or `Keyboard` stuff
         *  we have to listen `eventBus`. But for now we have only `spawnEntity`
         *  signal
         */
        this.connections.add(
            this.eventBusService.removeSelection.connect(this.deselectAll),
        );
        this.connections.add(
            this.eventBusService.entities.deselect.connect(this.deselectOne),
        );
    }

    protected override onDisable(): void {
        this.entities = [];

        this.connections.disconnectAll();
    }

    private deselectAll = (): void => {
        this.deselectObjects = true;
    };

    private deselectOne = (entity: Entity): void => {
        this.deselectionObjectsQueue.push(entity);
    };

    update(): void {
        /** If we want to deselect all entities */
        if (this.deselectObjects) {
            for (const entity of this.entities) {
                entity.remove(SelectedComponent);
            }

            this.deselectObjects = false;

            return;
        }

        /** If we want to deselect only specifics objects */
        if (this.deselectionObjectsQueue.length) {
            for (const entity of this.deselectionObjectsQueue) {
                entity.remove(SelectedComponent);
            }

            this.deselectionObjectsQueue = [];

            return;
        }
    }
}
