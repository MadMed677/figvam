import {Inject, Service} from 'typedi';
import {Entity, EntitySystem, Family} from 'typed-ecstasy';
import {
    PositionComponent,
    SelectedComponent,
    SelectionToolComponent,
    SizeComponent,
} from '../components';
import {EventBusService, ISelectionTool} from '../services';
import {SignalConnections} from 'typed-signals';
import {SelectionToolGraphics} from '../graphics';

@Service()
export class EntitySelectorSystem extends EntitySystem {
    @Inject()
    private readonly eventBus!: EventBusService;

    private readonly connections = new SignalConnections();
    private entities: Entity[] = [];
    private position = {
        x: 0,
        y: 0,
    };
    private selectionQueue: Entity[] = [];

    protected override onEnable(): void {
        this.entities = this.engine.entities.forFamily(
            Family.all(SizeComponent, PositionComponent)
                .one(SelectionToolComponent, SelectedComponent)
                .get(),
        );

        this.connections.add(
            this.eventBus.entities.select.connect(this.selectEntity.bind(this)),
        );
        this.connections.add(
            this.eventBus.showSelectionTool.connect(
                this.showSelectionCreatorTool.bind(this),
            ),
        );
    }

    protected override onDisable(): void {
        this.entities = [];

        this.connections.disconnectAll();
    }

    private selectEntity(entity: Entity) {
        this.selectionQueue.push(entity);
    }

    /** Create selection tool */
    private showSelectionCreatorTool(options: ISelectionTool): void {
        switch (options.state) {
            case 'start': {
                this.eventBus.removeSelection.emit();
                this.eventBus.entities.create.emit({
                    blueprint: {
                        name: 'selection_tool',
                        data: {
                            size: {
                                width: 0,
                                height: 0,
                            },
                        },
                        graphics: SelectionToolGraphics,
                    },
                    position: {
                        x: options.position.x,
                        y: options.position.y,
                    },
                });

                this.position = {
                    x: options.position.x,
                    y: options.position.y,
                };

                return;
            }

            case 'progress': {
                this.position = {
                    x: options.position.x,
                    y: options.position.y,
                };

                return;
            }

            case 'end': {
                // Removing SelectionCreationTool
                this.eventBus.entities.destroyByComponents.emit([
                    SelectionToolComponent,
                ]);
            }
        }
    }

    update(): void {
        /** Update selection creation tool */
        for (const entity of this.entities) {
            const size = entity.require(SizeComponent);
            const position = entity.require(PositionComponent);

            /** Update size if it's a "SelectionToolComponent" */
            if (entity.has(SelectionToolComponent)) {
                size.width = this.position.x - position.x;
                size.height = this.position.y - position.y;
            }
        }

        /** Should set `SelectedComponent` */
        if (this.selectionQueue.length) {
            for (const entity of this.selectionQueue) {
                entity.add(new SelectedComponent());
            }

            this.selectionQueue = [];
        }
    }
}
