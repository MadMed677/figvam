import {Inject, Service} from 'typedi';
import {Entity, Family, IteratingSystem} from 'typed-ecstasy';

import {
    GraphicsComponent,
    PositionComponent,
    SelectedComponent,
    SizeComponent,
} from '../components';
import {ThemeService} from '../services';

@Service()
export class RenderSystem extends IteratingSystem {
    constructor() {
        super(
            Family.all(
                PositionComponent,
                GraphicsComponent,
                SizeComponent,
            ).get(),
        );
    }

    @Inject()
    private readonly themeService!: ThemeService;

    protected override processEntity(entity: Entity): void {
        const position = entity.require(PositionComponent);
        const size = entity.require(SizeComponent);
        const graphics = entity.require(GraphicsComponent);
        const selected = entity.get(SelectedComponent);

        const nextProps = {
            position: {
                x: position.x,
                y: position.y,
            },
            size: {
                width: size.width,
                height: size.height,
            },
            theme: this.themeService.getTheme(),
            mode: selected ? 'selected' : 'normal',
        };

        if (graphics.visual.shouldComponentUpdate(nextProps)) {
            graphics.visual.setProps(nextProps);
            graphics.visual.render();
        }
    }
}
