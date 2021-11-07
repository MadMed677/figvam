import '@abraham/reflection';

import * as PIXI from 'pixi.js';
import {FigvamEngine} from './core/figvam.engine';
import {
    MouseSystem,
    MovementSystem,
    EntityCreatorSystem,
    EntitySelectorSystem,
    EntityDeselectorSystem,
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
import {EntityDestroyerSystem} from './systems/entity_destroyer.system';

export {Engine} from 'typed-ecstasy';

interface IFigvamFactoryCreate {
    engine: Engine;
    graphics: PIXI.Application;
}

/**
 * The Factory for creating Figvam Whiteboard Engine
 *
 * ## Example
 * ```typescript
 * import {FigvamFactory} from '@figvam/whiteboard'
 *
 * const {engine, graphics} = new FigvamFactory().create();
 *
 * // Subscribe for each tick and update the engine
 * graphics.ticker.add(() => {
 *     engine.update(0.16);
 * })
 *
 * document
 *  // Take the DOM element to place whiteboard
 *  .querySelector('#container_for_whiteboard')!
 *
 *  // Add all application inside that container
 *  .appendChild(graphics.view)
 * ```
 */
export class FigvamFactory {
    /** Creates new engine and PIXI.Application */
    public create(): IFigvamFactoryCreate {
        const engine = FigvamEngine.getBuilder()
            .withSystem(MouseSystem)
            .withSystem(MovementSystem)
            .withSystem(EntityDeselectorSystem)
            .withSystem(EntityCreatorSystem)
            .withSystem(EntitySelectorSystem)
            .withSystem(EntityDestroyerSystem)
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
