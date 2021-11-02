import {Service} from 'typedi';
import * as PIXI from 'pixi.js';
import {Signal} from 'typed-signals';
import {Entity, EntitySystem} from 'typed-ecstasy';

import {PixiService} from '../services';

export interface IClickOptions {
    position: {
        x: number;
        y: number;
    };
}

export interface IDragOptions {
    state: 'start' | 'progress' | 'end';
    position: {
        x: number;
        y: number;
    };
}

@Service()
export class MouseSystem extends EntitySystem {
    private readonly interactionManager: PIXI.InteractionManager;
    private pointerDown = false;
    private pointerMove = false;
    private activeEntity: Entity | undefined;

    public onClick = new Signal<
        (entity: Entity, options: IClickOptions) => void
    >();
    public onDrag = new Signal<
        (entity: Entity, options: IDragOptions) => void
    >();

    constructor(pixiService: PixiService) {
        super();

        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);

        this.interactionManager = pixiService.getApplication().renderer.plugins
            .interaction as PIXI.InteractionManager;
        this.interactionManager.autoPreventDefault = true;
    }

    protected override onEnable(): void {
        this.interactionManager.on('pointerdown', this.onPointerDown);
        this.interactionManager.on('pointerup', this.onPointerUp);
        this.interactionManager.on('pointermove', this.onPointerMove);
    }

    protected override onDisable(): void {
        this.interactionManager.removeListener(
            'pointerdown',
            this.onPointerDown,
        );
        this.interactionManager.removeListener('pointerup', this.onPointerUp);
        this.interactionManager.removeListener(
            'pointermove',
            this.onPointerMove,
        );
    }

    private onPointerDown(e: PIXI.InteractionEvent) {
        this.pointerDown = true;

        const entityId = Number(e.target.name);
        this.activeEntity = this.engine.entities.get(entityId)!;
    }

    private onPointerUp(e: PIXI.InteractionEvent) {
        if (this.pointerDown) {
            if (this.pointerMove) {
                this.pointerMove = false;

                this.onDragEnd(e, this.activeEntity!);
            } else {
                this.onClickStart(e, this.activeEntity!);
            }

            this.pointerDown = false;
        }
    }

    private onPointerMove(e: PIXI.InteractionEvent) {
        if (this.pointerDown) {
            if (!this.pointerMove) {
                this.pointerMove = true;

                this.onDragStart(e, this.activeEntity!);
            } else {
                this.onDragging(e, this.activeEntity!);
            }
        }
    }

    private onClickStart(e: PIXI.InteractionEvent, entity: Entity) {
        this.onClick.emit(entity, {
            position: {
                x: e.data.global.x,
                y: e.data.global.y,
            },
        });
    }

    private onDragStart(e: PIXI.InteractionEvent, entity: Entity) {
        this.onDrag.emit(entity, {
            state: 'start',
            position: {
                x: e.data.global.x,
                y: e.data.global.y,
            },
        });
    }

    private onDragging(e: PIXI.InteractionEvent, entity: Entity) {
        this.onDrag.emit(entity, {
            state: 'progress',
            position: {
                x: e.data.global.x,
                y: e.data.global.y,
            },
        });
    }

    private onDragEnd(e: PIXI.InteractionEvent, entity: Entity) {
        this.onDrag.emit(entity, {
            state: 'end',
            position: {
                x: e.data.global.x,
                y: e.data.global.y,
            },
        });
    }

    update(): void {}
}
