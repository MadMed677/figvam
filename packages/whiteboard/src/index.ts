import '@abraham/reflection';

import * as PIXI from 'pixi.js';
import {FigvamEngine} from './core/figvam.engine';
import {
    MouseSystem,
    MovementSystem,
    ObjectCreatorSystem,
    ObjectSelectorSystem,
    RenderSystem,
} from './systems';
import {
    GraphicsComponent,
    PositionComponent,
    SelectableComponent,
    SizeComponent,
    SpawnableComponent,
} from './components';
import {CanvasBackgroundGraphics, StickerGraphics} from './graphics';
import {Engine} from 'typed-ecstasy';
import {PixiService} from './services';

export {Engine} from 'typed-ecstasy';

export class Figvam {
    public create(): {
        engine: Engine;
        graphics: PIXI.Application;
    } {
        const engine = FigvamEngine.getBuilder()
            .withSystem(MouseSystem)
            .withSystem(MovementSystem)
            .withSystem(ObjectCreatorSystem)
            .withSystem(ObjectSelectorSystem)
            .withSystem(RenderSystem)
            .withEntity(entity => {
                entity.add(
                    new GraphicsComponent(
                        new CanvasBackgroundGraphics(entity.getId()),
                    ),
                );
                entity.add(new PositionComponent(0, 0));
                entity.add(
                    new SizeComponent(window.innerWidth, window.innerHeight),
                );
                entity.add(new SpawnableComponent());
            })
            .withEntity(entity => {
                entity.add(
                    new GraphicsComponent(new StickerGraphics(entity.getId())),
                );
                entity.add(new SelectableComponent());
                entity.add(new PositionComponent(200, 200));
                entity.add(new SizeComponent(100, 100));
            })
            .build();

        const container = engine.getContainer();
        const pixiService = container.get(PixiService);

        return {
            engine: engine,
            graphics: pixiService.getApplication(),
        };
    }
}
