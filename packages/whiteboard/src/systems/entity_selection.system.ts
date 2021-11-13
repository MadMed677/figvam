import {Entity, EntitySystem, Family} from 'typed-ecstasy';
import {Inject, Service} from 'typedi';
import {
    PositionComponent,
    SelectedComponent,
    SelectionComponent,
    SizeComponent,
} from '../components';
import {EventBusService} from '../services';
import {SignalConnections} from 'typed-signals';

@Service()
export class EntitySelectionSystem extends EntitySystem {
    @Inject()
    private readonly eventBus!: EventBusService;

    private readonly connections = new SignalConnections();

    /** All Selected entities */
    private selectedEntities: Entity[] = [];

    /** All (general only one) Selection entities */
    private selectionEntities: Entity[] = [];

    protected override onEnable(): void {
        this.selectedEntities = this.engine.entities.forFamily(
            Family.all(SizeComponent, PositionComponent, SelectedComponent)
                .exclude(SelectionComponent)
                .get(),
        );
        this.selectionEntities = this.engine.entities.forFamily(
            Family.all(SelectionComponent).get(),
        );

        this.connections.add(
            this.eventBus.removeSelection.connect(
                this.removeSelector.bind(this),
            ),
        );
    }

    private removeSelector(): void {
        this.eventBus.destroyEntityByComponents.emit([SelectionComponent]);
    }

    protected override onDisable(): void {
        this.selectedEntities = [];
        this.selectionEntities = [];

        this.connections.disconnectAll();
    }

    update(): void {
        /** Do nothing if we have only one selected entity */
        if (this.selectedEntities.length <= 1) {
            return;
        }

        const firstEntityPosition =
            this.selectedEntities[0].require(PositionComponent);

        /** Create lower and higher X and Y values just to create mock calculation values */
        let lowerX = firstEntityPosition.x;
        let lowerY = firstEntityPosition.y;
        let higherX = firstEntityPosition.x;
        let higherY = firstEntityPosition.y;

        /** Calculate actual lower and higher X and Y values */
        for (const entity of this.selectedEntities) {
            const position = entity.require(PositionComponent);

            /** Set x1 */
            if (position.x < lowerX) {
                lowerX = position.x;
            }

            /** Set y1 */
            if (position.y < lowerY) {
                lowerY = position.y;
            }

            /** Set x2 */
            if (position.x > higherX) {
                higherX = position.x;
            }

            /** Set y2 */
            if (position.y > higherY) {
                higherY = position.y;
            }
        }

        for (const entity of this.selectionEntities) {
            const position = entity.require(PositionComponent);
            const size = entity.require(SizeComponent);

            position.x = lowerX - 8;
            position.y = lowerY - 8;

            size.width = higherX - lowerX + 100 + 8 + 8;
            size.height = higherY - lowerY + 100 + 8 + 8;
        }
    }
}
