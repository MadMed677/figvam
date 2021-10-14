import {Entity, EntitySystem} from 'typed-ecstasy';
import {Service} from 'typedi';
import {RenderSystem} from './render.system';
import {GraphicsComponent, PositionComponent} from '../components';
import * as PIXI from 'pixi.js';
import {StickerGraphics} from '../graphics/sticker.graphics';

@Service()
export class ObjectCreatorSystem extends EntitySystem {
    constructor(renderSystem: RenderSystem) {
        super();

        this.createObject = this.createObject.bind(this);
        renderSystem.onClick.connect(this.createObject);
    }

    private createObject(e: PIXI.InteractionEvent) {
        const position = e.data.global;

        const sticker = new Entity();
        sticker.add(new PositionComponent(position.x, position.y));
        sticker.add(new GraphicsComponent(new StickerGraphics()));

        this.engine.entities.add(sticker);

        console.log('engine: ', this.engine);
    }

    update(): void {
        console.log('[ObjectCreatorSystem]');
    }
}
