import '@abraham/reflection';
import './style.css';

import {FigvamEngine} from './core/figvam.engine';
import {FpsService} from './services';
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

const engine = FigvamEngine.getBuilder()
    .withSystem(MouseSystem)
    .withSystem(MovementSystem)
    .withSystem(ObjectCreatorSystem)
    .withSystem(ObjectSelectorSystem)
    .withSystem(RenderSystem)
    .withEntity(entity => {
        entity.add(
            new GraphicsComponent(new CanvasBackgroundGraphics(entity.getId())),
        );
        entity.add(new PositionComponent(0, 0));
        entity.add(new SizeComponent(window.innerWidth, window.innerHeight));
        entity.add(new SpawnableComponent());
    })
    .withEntity(entity => {
        entity.add(new GraphicsComponent(new StickerGraphics(entity.getId())));
        entity.add(new SelectableComponent());
        entity.add(new PositionComponent(0, 0));
        entity.add(new SizeComponent(100, 100));
    })
    .build();

const fpsService = new FpsService(40, time => {
    engine.update(time);
});

window.engine = engine;

fpsService.start();
