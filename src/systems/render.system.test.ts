import * as PIXI from 'pixi.js';
import {Engine, Entity} from 'typed-ecstasy';

import {RenderSystem} from './';
import {GraphicsComponent, PositionComponent} from '../components';
import {IGraphics} from '../graphics';

interface IGraphicMockProps {
    position: {x: number; y: number};
    size: {width: number; height: number};
}

class GraphicMock implements IGraphics<IGraphicMockProps> {
    readonly visual = new PIXI.Graphics();
    public render = jest.fn();
}

describe('RenderSystem', () => {
    test('should update all GraphicComponents when PositionComponent and GraphicsComponent were provided', () => {
        const engine = new Engine();
        engine.systems.add(RenderSystem);

        const sticker1 = new Entity();
        const stickerGraphics1 = new GraphicMock();
        sticker1.add(new PositionComponent(0, 0));
        sticker1.add(new GraphicsComponent(stickerGraphics1));

        const sticker2 = new Entity();
        const stickerGraphics2 = new GraphicMock();
        sticker2.add(new PositionComponent(100, 100));
        sticker2.add(new GraphicsComponent(stickerGraphics2));

        engine.entities.add(sticker1);
        engine.entities.add(sticker2);

        expect(stickerGraphics1.render).not.toBeCalled();
        expect(stickerGraphics2.render).not.toBeCalled();

        engine.update(0.16);

        expect(stickerGraphics1.render).toBeCalledWith({
            position: {
                x: 0,
                y: 0,
            },
            size: {
                width: 100,
                height: 100,
            },
        });
        expect(stickerGraphics2.render).toBeCalledWith({
            position: {
                x: 100,
                y: 100,
            },
            size: {
                width: 100,
                height: 100,
            },
        });
    });

    test('should update 2 out of 3 GraphicComponents when Graphic and Position components were provided but one entity does not have Position', () => {
        const engine = new Engine();
        engine.systems.add(RenderSystem);

        // Has Position and Graphics components
        const entity1 = new Entity();
        const entityGraphics1 = new GraphicMock();
        entity1.add(new PositionComponent(0, 0));
        entity1.add(new GraphicsComponent(entityGraphics1));

        // Has Position and Graphics components
        const entity2 = new Entity();
        const entityGraphics2 = new GraphicMock();
        entity2.add(new PositionComponent(100, 100));
        entity2.add(new GraphicsComponent(entityGraphics2));

        // Has NOT Position component only Graphics
        const entity3 = new Entity();
        const entityGraphics3 = new GraphicMock();
        entity3.add(new GraphicsComponent(entityGraphics3));

        engine.entities.add(entity1);
        engine.entities.add(entity2);
        engine.entities.add(entity3);

        expect(entityGraphics1.render).not.toBeCalled();
        expect(entityGraphics2.render).not.toBeCalled();
        expect(entityGraphics3.render).not.toBeCalled();

        engine.update(0.16);

        expect(entityGraphics1.render).toBeCalled();
        expect(entityGraphics2.render).toBeCalled();
        expect(entityGraphics3.render).not.toBeCalled();
    });
});
