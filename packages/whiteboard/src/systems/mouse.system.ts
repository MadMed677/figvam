import {Inject, Service} from 'typedi';
import * as PIXI from 'pixi.js';
import {Entity, EntitySystem, Family} from 'typed-ecstasy';

import {EventBusService, PixiService} from '../services';
import {
    SelectableComponent,
    SelectedComponent,
    SpawnableComponent,
} from '../components';
import {FigvamApi} from '../core/api/figvam.api';

import {StickerGraphics} from '../graphics';

import {
    CreationSubType,
    InteractionTypes,
    SelectionSubType,
} from '../core/api/interaction';

@Service()
export class MouseSystem extends EntitySystem {
    private readonly interactionManager: PIXI.InteractionManager;
    private pointerDown = false;
    private pointerMove = false;

    /**
     * @todo LongClick shouldn't have a different methods
     * It definitely must have the same logic as `click` does
     *  because we may click -> drag or `doubleClick` -> drag
     *  and all of these scenarios is definitely fine
     *
     * But now they are different and it will cause some issues
     *  in the future
     */
    private longClick = false;
    private longClickTimeout = 0;
    private activeEntity: Entity | undefined;

    @Inject()
    private readonly eventBus!: EventBusService;

    @Inject()
    private readonly figvamApi!: FigvamApi;

    private readonly pixiService: PixiService;

    constructor(pixiService: PixiService) {
        super();

        this.pixiService = pixiService;
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onLongClickStart = this.onLongClickStart.bind(this);
        this.onLongClickProgress = this.onLongClickProgress.bind(this);
        this.onLongClickStop = this.onLongClickStop.bind(this);

        this.interactionManager = pixiService.getApplication().renderer.plugins
            .interaction as PIXI.InteractionManager;
    }

    protected override onEnable(): void {
        this.interactionManager.on('pointerdown', this.onPointerDown);
        this.interactionManager.on('pointerup', this.onPointerUp);
        this.interactionManager.on('pointermove', this.onPointerMove);
    }

    protected override onDisable(): void {
        this.interactionManager.off('pointerdown', this.onPointerDown);
        this.interactionManager.off('pointerup', this.onPointerUp);
        this.interactionManager.off('pointermove', this.onPointerMove);
    }

    private onPointerDown(e: PIXI.InteractionEvent) {
        this.pointerDown = true;

        const entityId = Number(e.target.name);
        this.activeEntity = this.engine.entities.get(entityId);

        this.longClickTimeout = window.setTimeout(() => {
            this.onLongClickStart(e);
        }, 300);
    }

    private onPointerUp(e: PIXI.InteractionEvent) {
        if (this.pointerDown) {
            this.pointerDown = false;

            if (this.longClick) {
                this.onLongClickStop(e);

                return;
            }

            if (this.pointerMove) {
                this.pointerMove = false;

                this.onDragEnd(e, this.activeEntity);
                // Click
            } else {
                this.onClickStart(e, this.activeEntity);
            }
        }

        this.clearLongClickTimeout();
    }

    private onPointerMove(e: PIXI.InteractionEvent) {
        if (this.pointerDown) {
            this.clearLongClickTimeout();

            // Handle long clicks
            if (this.longClick) {
                this.onLongClickProgress(e);

                return;
            }

            // Drag
            if (!this.pointerMove) {
                this.pointerMove = true;

                this.onDragStart(e, this.activeEntity);
            } else {
                this.onDragging(e, this.activeEntity);
            }
        }
    }

    private onClickStart(e: PIXI.InteractionEvent, entity?: Entity) {
        const position = e.target.getGlobalPosition();

        console.log(
            e.target.getGlobalPosition(),
            {
                // @ts-ignore
                offsetX: e.data.originalEvent.offsetX,
                // @ts-ignore
                offsetY: e.data.originalEvent.offsetY,
            },
            e.data.global,
            e.data.getLocalPosition(this.pixiService.getViewportContainer()),
        );
        const interactionMode = this.figvamApi.interaction.getMode();

        /** @todo All interaction handling must be in a different handler */
        if (
            interactionMode.type === InteractionTypes.Selection &&
            interactionMode.subType === SelectionSubType.Hand
        ) {
            return;
        }

        /** Trigger an event to remove selection */
        this.eventBus.removeSelection.emit();

        if (
            interactionMode.type === InteractionTypes.Creation &&
            interactionMode.subType === CreationSubType.Sticker
        ) {
            console.log('e: ', e);
            /**
             * We definitely should create entity via Factory
             * As an example: https://lusito.github.io/typed-ecstasy/guide/data-driven/components.html
             */
            this.eventBus.entities.create.emit({
                blueprint: {
                    name: 'sticker',
                    data: {
                        size: {
                            width: 100,
                            height: 100,
                        },
                    },
                    graphics: StickerGraphics,
                },
                position: {
                    x: position.x,
                    y: position.y,
                    // x: e.data.global.x,
                    // y: e.data.global.y,
                    // x:
                    //     e.data.global.x -
                    //     this.pixiService.getViewportContainer().worldWidth / 2,
                    // y:
                    //     e.data.global.y -
                    //     this.pixiService.getViewportContainer().worldHeight / 2,
                },
            });

            return;
        }

        // We may select only Selectable entities
        if (entity && entity.has(SelectableComponent)) {
            this.eventBus.entities.select.emit(entity);

            return;
        }
    }

    private startDragCoords = {
        x: 0,
        y: 0,
    };

    private onDragStart(e: PIXI.InteractionEvent, entity?: Entity) {
        if (entity && entity.get(SpawnableComponent)) {
            this.eventBus.showSelectionTool.emit({
                state: 'start',
                position: {
                    x: e.data.global.x,
                    y: e.data.global.y,
                },
            });
        }

        this.startDragCoords.x = e.data.global.x;
        this.startDragCoords.y = e.data.global.y;
    }

    private onDragging(e: PIXI.InteractionEvent, entity?: Entity) {
        if (entity && entity.get(SelectableComponent)) {
            if (!entity.get(SelectedComponent)) {
                this.eventBus.removeSelection.emit();

                /** Trigger to move entities */
                this.eventBus.entities.move.emit([entity], {
                    position: {
                        dx: e.data.global.x - this.startDragCoords.x,
                        dy: e.data.global.y - this.startDragCoords.y,
                    },
                });
            } else {
                const entities = this.engine.entities.forFamily(
                    Family.all(SelectedComponent).get(),
                );

                this.eventBus.entities.move.emit(entities, {
                    position: {
                        dx: e.data.global.x - this.startDragCoords.x,
                        dy: e.data.global.y - this.startDragCoords.y,
                    },
                });
            }
        } else if (entity && entity.get(SpawnableComponent)) {
            this.eventBus.showSelectionTool.emit({
                state: 'progress',
                position: {
                    x: e.data.global.x,
                    y: e.data.global.y,
                },
            });
        }

        this.startDragCoords.x = e.data.global.x;
        this.startDragCoords.y = e.data.global.y;
    }

    private onDragEnd(e: PIXI.InteractionEvent, entity?: Entity): void {
        if (!entity) {
            this.eventBus.showSelectionTool.emit({
                state: 'end',
                position: {
                    x: e.data.global.x,
                    y: e.data.global.y,
                },
            });
        }

        this.startDragCoords = {
            x: 0,
            y: 0,
        };
    }

    private onLongClickStart(e: PIXI.InteractionEvent): void {
        this.longClick = true;

        this.interactionManager.cursorStyles.default = 'crosshair';
        this.interactionManager.setCursorMode('crosshair');

        this.eventBus.showSelectionTool.emit({
            state: 'start',
            position: {
                x: e.data.global.x,
                y: e.data.global.y,
            },
        });

        this.clearLongClickTimeout();
    }

    private onLongClickProgress(e: PIXI.InteractionEvent): void {
        this.eventBus.showSelectionTool.emit({
            state: 'progress',
            position: {
                x: e.data.global.x,
                y: e.data.global.y,
            },
        });
    }

    private onLongClickStop(e: PIXI.InteractionEvent): void {
        this.longClick = false;

        this.interactionManager.cursorStyles.default = 'inherit';
        this.interactionManager.setCursorMode('inherit');

        this.eventBus.showSelectionTool.emit({
            state: 'end',
            position: {
                x: e.data.global.x,
                y: e.data.global.y,
            },
        });
    }

    private clearLongClickTimeout() {
        window.clearTimeout(this.longClickTimeout);
    }

    update(): void {}
}
