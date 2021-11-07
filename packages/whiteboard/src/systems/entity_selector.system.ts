import {Inject, Service} from 'typedi';
import {Entity, EntitySystem, Family} from 'typed-ecstasy';
import {
    DestroyedComponent,
    GraphicsComponent,
    PositionComponent,
    SelectableComponent,
    SelectedComponent,
    SizeComponent,
} from '../components';
import {MouseSystem} from './mouse.system';
import {SelectionGraphics, SelectionToolGraphics} from '../graphics';
import {EventBusService, ISelectionTool} from '../services';
import {SignalConnections} from 'typed-signals';

interface IPoint {
    x: number;
    y: number;
}

function doOverlap(l1: IPoint, r1: IPoint, l2: IPoint, r2: IPoint): boolean {
    // To check if either rectangle is actually a line
    // For example : l1 ={-1,0} r1={1,1} l2={0,-1} r2={0,1}

    if (l1.x == r1.x || l1.y == r1.y || l2.x == r2.x || l2.y == r2.y) {
        // the line cannot have positive overlap
        return false;
    }

    // If one rectangle is on left side of other
    if (l1.x >= r2.x || l2.x >= r1.x) {
        return false;
    }

    // If one rectangle is above other
    if (r1.y <= l2.y || r2.y <= l1.y) {
        return false;
    }

    return true;
}

interface ICoord {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

function doOverlap2(selection: ICoord, entity: ICoord): boolean {
    // Moving from left to right and top to bottom
    return (
        selection.x2 >= entity.x1 &&
        selection.y2 >= entity.y1 &&
        selection.x1 <= entity.x2 &&
        selection.y1 <= entity.y2
    );
}

@Service()
export class EntitySelectorSystem extends EntitySystem {
    @Inject()
    private readonly mouseSystem!: MouseSystem;

    @Inject()
    private readonly eventBusService!: EventBusService;

    private readonly connections = new SignalConnections();
    private selectEntityQueue: Entity[] = [];

    protected override onEnable(): void {
        this.connections.add(
            this.eventBusService.selectEntity.connect(
                this.selectEntity.bind(this),
            ),
        );
        this.connections.add(
            this.eventBusService.showSelectionTool.connect(
                this.showSelectionCreatorTool.bind(this),
            ),
        );
        this.connections.add(
            this.eventBusService.removeSelection.connect(
                this.removeSelector.bind(this),
            ),
        );
    }

    protected override onDisable(): void {
        this.connections.disconnectAll();
    }

    private selectEntity(entity: Entity) {
        this.selectEntityQueue.push(entity);
    }

    private selectionToolEntityId!: number;

    /**
     * Create selection tool
     *
     * @todo Rewrite current handler and the main approach to work with clicks on the canvas
     *
     * @description It's a highly un-performant code. I must rewrite it as soon as posible
     *  because now it's so slow plus the selection system creates selection tool
     *  and contain a bunch of logic and it's so hard to maintain even me
     *
     * @private
     */
    private showSelectionCreatorTool(options: ISelectionTool): void {
        switch (options.state) {
            case 'start': {
                this.eventBusService.removeSelection.emit();

                const selectionTool = new Entity();
                this.engine.entities.add(selectionTool);

                this.selectionToolEntityId = selectionTool.getId();

                // selectionTool.add(new SelectedComponent());
                selectionTool.add(
                    new PositionComponent(
                        options.position.x,
                        options.position.y,
                    ),
                );
                selectionTool.add(new SizeComponent(0, 0));
                selectionTool.add(
                    new GraphicsComponent(
                        new SelectionToolGraphics(this.selectionToolEntityId),
                    ),
                );

                return;
            }

            case 'progress': {
                const selectionTool = this.engine.entities.get(
                    this.selectionToolEntityId,
                );

                if (!selectionTool) {
                    console.error(
                        '[progress] Cannot find selection tool by id: ',
                        this.selectionToolEntityId,
                    );

                    return;
                }

                const sizeComponent = selectionTool.require(SizeComponent);
                const positionComponent =
                    selectionTool.require(PositionComponent);

                sizeComponent.width = options.position.x - positionComponent.x;
                sizeComponent.height = options.position.y - positionComponent.y;

                const selectableEntities = this.engine.entities.forFamily(
                    Family.all(
                        GraphicsComponent,
                        PositionComponent,
                        SelectableComponent,
                        SizeComponent,
                    ).get(),
                );

                // Select unselected components
                selectableEntities.forEach(entity => {
                    const position = entity.require(PositionComponent);
                    const size = entity.require(SizeComponent);

                    const selectionX1 = positionComponent.x;
                    const selectionX2 =
                        positionComponent.x + sizeComponent.width;
                    const selectionY1 = positionComponent.y;
                    const selectionY2 =
                        positionComponent.y + sizeComponent.height;

                    const entityX1 = position.x;
                    const entityX2 = position.x + size.width;
                    const entityY1 = position.y;
                    const entityY2 = position.y + size.height;

                    if (
                        doOverlap2(
                            {
                                x1:
                                    selectionX1 <= selectionX2
                                        ? selectionX1
                                        : selectionX2,
                                y1:
                                    selectionY1 <= selectionY2
                                        ? selectionY1
                                        : selectionY2,
                                x2:
                                    selectionX1 <= selectionX2
                                        ? selectionX2
                                        : selectionX1,
                                y2:
                                    selectionY1 <= selectionY2
                                        ? selectionY2
                                        : selectionY1,
                            },
                            {
                                x1: entityX1,
                                y1: entityY1,
                                x2: entityX2,
                                y2: entityY2,
                            },
                        )
                    ) {
                        entity.add(new SelectedComponent());
                    } else {
                        const selectedComponent = entity.get(SelectedComponent);

                        if (selectedComponent) {
                            entity.remove(SelectedComponent);
                        }
                    }
                });

                return;
            }

            case 'end': {
                this.removeSelectionCreatorTool();

                /** Trigger an event to destroy an entity */
                // this.eventBusService.destroyEntity.emit(selectionTool);

                this.showSelector();
            }
        }
    }

    private removeSelectionCreatorTool(): void {
        const selectionTool = this.engine.entities.get(
            this.selectionToolEntityId,
        );

        if (!selectionTool) {
            return;
        }

        selectionTool.add(new DestroyedComponent());
    }

    private selectionEntityId!: number;

    private showSelector(): void {
        const selectedEntities = this.engine.entities.forFamily(
            Family.all(
                SelectedComponent,
                PositionComponent,
                SizeComponent,
            ).get(),
        );

        /** We want to create Selection if we had 2 or more entities */
        if (selectedEntities.length <= 1) {
            return;
        }

        const firstEntityPosition =
            selectedEntities[0].require(PositionComponent);

        let lowerX = firstEntityPosition.x;
        let lowerY = firstEntityPosition.y;
        let higherX = firstEntityPosition.x;
        let higherY = firstEntityPosition.y;

        selectedEntities.forEach(entity => {
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
        });

        /** --- */
        const selection = new Entity();
        this.engine.entities.add(selection);

        this.selectionEntityId = selection.getId();

        selection.add(new SelectedComponent());
        selection.add(new SelectableComponent());
        selection.add(new PositionComponent(lowerX - 8, lowerY - 8));
        selection.add(
            new SizeComponent(
                higherX - lowerX + 100 + 8 + 8,
                higherY - lowerY + 100 + 8 + 9,
            ),
        );
        selection.add(
            new GraphicsComponent(
                new SelectionGraphics(this.selectionEntityId),
            ),
        );

        /** @todo Must be a real entities value */
        // this.eventBusService.createEntity.emit({
        //     position: {
        //         x: lowerX - 8,
        //         y: lowerY - 8,
        //     },
        //     blueprint: {
        //         name: 'selection',
        //         data: {
        //             size: {
        //                 width: higherX - lowerX + 100 + 8 + 8,
        //                 height: higherY - lowerY + 100 + 8 + 8,
        //             },
        //         },
        //     },
        // });
    }

    private removeSelector(): void {
        const selection = this.engine.entities.get(this.selectionEntityId);

        if (!selection) {
            return;
        }

        selection.add(new DestroyedComponent());
    }

    update(): void {
        if (this.selectEntityQueue.length === 0) {
            return;
        }

        this.selectEntityQueue.forEach(entity => {
            if (entity.get(SelectedComponent)) {
                entity.remove(SelectedComponent);
            } else {
                entity.add(new SelectedComponent());
            }
        });

        this.selectEntityQueue = [];
    }
}
