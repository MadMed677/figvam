import {Entity, EntitySystem, Family} from 'typed-ecstasy';
import {EventBusService} from '../services';
import {Inject, Service} from 'typedi';
import {SignalConnections} from 'typed-signals';
import {DestroyedComponent, GraphicsComponent} from '../components';

@Service()
export class EntityDestroyerSystem extends EntitySystem {
    @Inject()
    private readonly eventBus!: EventBusService;

    private readonly connections = new SignalConnections();
    private entities: Entity[] = [];

    protected override onEnable(): void {
        this.entities = this.engine.entities.forFamily(
            Family.all(DestroyedComponent).get(),
        );

        this.connections.add(
            this.eventBus.destroyEntity.connect(this.destroyEntity.bind(this)),
        );
    }

    protected override onDisable(): void {
        this.entities = [];

        this.connections.disconnectAll();
    }

    private destroyEntity(entity: Entity): void {
        const graphics = entity.get(GraphicsComponent);

        if (!graphics) {
            throw new Error(
                `Entity must have GraphicsComponent. By entity by id: ${entity.getId()} does not have it`,
            );
        }

        /** Destroy visual */
        graphics.visual.destroy?.();

        this.engine.entities.remove(entity);
    }

    update(): void {
        for (const entity of this.entities) {
            const graphics = entity.get(GraphicsComponent);

            /** Destroy visual */
            graphics?.visual.destroy?.();

            /** Destroy entity */
            this.engine.entities.remove(entity);
        }
    }
}
