import {Inject, Service} from 'typedi';
import {Entity, EntitySystem, Family} from 'typed-ecstasy';

import {
    GraphicsComponent,
    PositionComponent,
    SelectedComponent,
    SizeComponent,
} from '../components';
import {PixiService} from '../services';

@Service()
export class RenderSystem extends EntitySystem {
    private entities: Entity[] = [];

    @Inject()
    private readonly pixiService!: PixiService;

    protected override onEnable(): void {
        this.entities = this.engine.entities.forFamily(
            Family.all(
                PositionComponent,
                GraphicsComponent,
                SizeComponent,
            ).get(),
        );
    }

    protected override onDisable(): void {
        this.entities = [];
    }

    public update(): void {
        for (const entity of this.entities) {
            const position = entity.require(PositionComponent);
            const size = entity.require(SizeComponent);
            const graphics = entity.require(GraphicsComponent);
            const selected = entity.get(SelectedComponent);

            graphics.visual.render({
                position,
                size,
                mode: selected ? 'selected' : 'normal',
            });

            this.pixiService
                .getApplication()
                .stage.addChild(graphics.visual.visual);
        }
    }
}
