import * as PIXI from 'pixi.js';

import {RenderSystem} from './';
import {
    GraphicsComponent,
    PositionComponent,
    SizeComponent,
} from '../components';
import {IGraphics} from '../graphics';
import {FigvamEngine} from '../core/figvam.engine';

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
        const entityGraphics1 = new GraphicMock();
        const entityGraphics2 = new GraphicMock();

        const engine = FigvamEngine.getBuilder()
            .withSystem(RenderSystem)
            .withEntity(entity => {
                entity.add(new PositionComponent(0, 0));
                entity.add(new SizeComponent(100, 100));
                entity.add(new GraphicsComponent(entityGraphics1));
            })
            .withEntity(entity => {
                entity.add(new PositionComponent(100, 100));
                entity.add(new SizeComponent(100, 100));
                entity.add(new GraphicsComponent(entityGraphics2));
            })
            .build();

        expect(entityGraphics1.render).not.toBeCalled();
        expect(entityGraphics2.render).not.toBeCalled();

        engine.update(0.16);

        expect(entityGraphics1.render).toBeCalledWith({
            position: {
                x: 0,
                y: 0,
            },
            mode: 'normal',
            size: {
                width: 100,
                height: 100,
            },
        });
        expect(entityGraphics2.render).toBeCalledWith({
            position: {
                x: 100,
                y: 100,
            },
            mode: 'normal',
            size: {
                width: 100,
                height: 100,
            },
        });
    });

    test('should update 2 out of 3 GraphicComponents when Graphic and Position components were provided but one entity does not have Position', () => {
        const entityGraphics1 = new GraphicMock();
        const entityGraphics2 = new GraphicMock();
        const entityGraphics3 = new GraphicMock();

        const engine = FigvamEngine.getBuilder()
            .withSystem(RenderSystem)
            .withEntity(entity => {
                entity.add(new PositionComponent(0, 0));
                entity.add(new SizeComponent(100, 100));
                entity.add(new GraphicsComponent(entityGraphics1));
            })
            .withEntity(entity => {
                entity.add(new PositionComponent(100, 100));
                entity.add(new SizeComponent(100, 100));
                entity.add(new GraphicsComponent(entityGraphics2));
            })
            .withEntity(entity => {
                // Has NOT Position component
                entity.add(new SizeComponent(100, 100));
                entity.add(new GraphicsComponent(entityGraphics3));
            })
            .build();

        expect(entityGraphics1.render).not.toBeCalled();
        expect(entityGraphics2.render).not.toBeCalled();
        expect(entityGraphics3.render).not.toBeCalled();

        engine.update(0.16);

        expect(entityGraphics1.render).toBeCalled();
        expect(entityGraphics2.render).toBeCalled();
        expect(entityGraphics3.render).not.toBeCalled();
    });
});
