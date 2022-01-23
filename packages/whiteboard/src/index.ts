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
    CollisionSystem,
    EntitySelectionSystem,
    GraphicsCreatorSystem,
} from './systems';
import {
    GraphicsComponent,
    PhysicsComponent,
    PositionComponent,
    SelectableComponent,
    SizeComponent,
    SpawnableComponent,
} from './components';
import {CanvasBackgroundGraphics, StickerGraphics} from './graphics';
import {Engine} from 'typed-ecstasy';
import {PixiService} from './services';
import {EntityDestroyerSystem} from './systems/entity_destroyer.system';
import {FigvamApi} from './core/api/figvam.api';

export {Engine} from 'typed-ecstasy';
export {FigvamApi};
export type {InteractionMode} from './core/api/interaction';

interface IFigvamFactoryCreate {
    engine: Engine;
    graphics: PIXI.Application;
    api: FigvamApi;
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
            .withSystem(EntitySelectionSystem)
            .withSystem(EntityDestroyerSystem)
            .withSystem(CollisionSystem)
            .withSystem(GraphicsCreatorSystem)
            .withSystem(RenderSystem)
            // .withEntity(entity => {
            //     entity.add(
            //         new GraphicsComponent(
            //             new CanvasBackgroundGraphics(entity.getId()),
            //         ),
            //     );
            //     entity.add(new PositionComponent(0, 0));
            //     entity.add(
            //         new SizeComponent(window.innerWidth, window.innerHeight),
            //     );
            //     entity.add(new SpawnableComponent());
            // })
            // .withEntity(entity => {
            //     entity.add(
            //         new GraphicsComponent(new StickerGraphics(entity.getId())),
            //     );
            //     entity.add(new SelectableComponent());
            //     entity.add(new PhysicsComponent());
            //     entity.add(new PositionComponent(200, 200));
            //     entity.add(new SizeComponent(100, 100));
            // })
            .build();

        const container = engine.getContainer();
        const pixiService = container.get(PixiService);
        const figvamApi = container.get(FigvamApi);

        return {
            engine: engine,
            graphics: pixiService.getApplication(),
            api: figvamApi,
        };
    }
}
