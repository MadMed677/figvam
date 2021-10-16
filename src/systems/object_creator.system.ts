import {Entity, EntitySystem} from 'typed-ecstasy';
import {Inject, Service} from 'typedi';
import {
    GraphicsComponent,
    PositionComponent,
    SelectableComponent,
    SizeComponent,
    SpawnableComponent,
} from '../components';
import {StickerGraphics} from '../graphics';
import {IClickOptions, MouseSystem} from './mouse.system';

@Service()
export class ObjectCreatorSystem extends EntitySystem {
    @Inject()
    mouseSystem!: MouseSystem;

    constructor() {
        super();

        this.onClickEventHandler = this.onClickEventHandler.bind(this);
    }

    protected override onEnable(): void {
        this.mouseSystem.onClick.connect(this.onClickEventHandler);
    }

    protected override onDisable(): void {}

    onClickEventHandler(entity: Entity, options: IClickOptions): void {
        /**
         * We don't need to react on any entities
         *  which hasn't "SpawnableComponent"
         */
        if (!entity.get(SpawnableComponent)) {
            return;
        }

        const sticker = new Entity();
        this.engine.entities.add(sticker);

        sticker.add(new SelectableComponent());
        sticker.add(
            new PositionComponent(options.position.x, options.position.y),
        );
        sticker.add(new SizeComponent(100, 100));
        sticker.add(
            new GraphicsComponent(new StickerGraphics(sticker.getId())),
        );
    }

    update(): void {}
}
