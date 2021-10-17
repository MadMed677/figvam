import '@abraham/reflection';

import {FigvamEngine} from './core/figvam.engine';
import {FpsService} from './services';
import {MovementSystem, ObjectCreatorSystem, RenderSystem} from './systems';

const engine = FigvamEngine.getBuilder()
    .withSystem(RenderSystem)
    .withSystem(MovementSystem)
    .withSystem(ObjectCreatorSystem)
    .build();

const fpsService = new FpsService(1, time => {
    engine.update(time);
});

fpsService.start();
