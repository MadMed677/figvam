import {
    ComponentConstructor,
    Entity,
    EntitySystem,
    Family,
} from 'typed-ecstasy';
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
        this.connections.add(
            this.eventBus.destroyEntityByComponents.connect(
                this.destroyEntityByComponents.bind(this),
            ),
        );
    }

    protected override onDisable(): void {
        this.entities = [];

        this.connections.disconnectAll();
    }

    private destroyEntity(entity: Entity): void {
        entity.add(new DestroyedComponent());
    }

    private destroyEntityByComponents(
        components: ComponentConstructor[],
    ): void {
        /** Try to match all entities which contain all `components` */
        const entities = this.engine.entities.forFamily(
            Family.all(...components).get(),
        );

        /** Add `DestroyedComponent` to remove this entity on next tick */
        entities.forEach(entity => {
            entity.add(new DestroyedComponent());
        });
    }

    /**
     * Process all entities which has `DestroyedComponent`
     *  and remove GraphicsComponent if they have
     *  and remove them from the engine
     */
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
