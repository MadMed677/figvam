import {Service} from 'typedi';
import {Signal} from 'typed-signals';
import {Entity, EntitySystem, Family} from 'typed-ecstasy';
import * as PIXI from 'pixi.js';
import {GraphicsComponent, PositionComponent} from '../components';

@Service()
export class RenderSystem extends EntitySystem {
    private entities: Entity[] = [];
    private application: PIXI.Application = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    protected override onEnable(): void {
        const background = new PIXI.Graphics();
        background.hitArea = new PIXI.Rectangle(0, 0, 10000, 10000);
        background.clear();
        background.beginFill(0x7d99e3, 1);
        background.drawRect(0, 0, window.innerWidth, window.innerHeight);
        background.endFill();
        background.interactive = true;

        this.application.stage.addChild(background);

        background.on('click', (e: PIXI.InteractionEvent) => {
            this.onClick.emit(e);
        });

        document.body.appendChild(this.application.view);

        this.entities = this.engine.entities.forFamily(
            Family.all(PositionComponent, GraphicsComponent).get(),
        );
    }

    protected override onDisable(): void {
        this.entities = [];
    }

    public onClick = new Signal<(e: PIXI.InteractionEvent) => void>();

    public update(): void {
        for (const entity of this.entities) {
            const position = entity.require(PositionComponent);
            const graphics = entity.require(GraphicsComponent);

            graphics.visual.render({
                position,
                size: {
                    width: 100,
                    height: 100,
                },
            });

            this.application.stage.addChild(graphics.visual.visual);
        }
    }
}
