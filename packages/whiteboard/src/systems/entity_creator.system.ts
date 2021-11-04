import {Entity, EntitySystem} from 'typed-ecstasy';
import {Inject, Service} from 'typedi';
import {
    GraphicsComponent,
    PositionComponent,
    SelectableComponent,
    SelectedComponent,
    SizeComponent,
} from '../components';
import {SelectionGraphics, StickerGraphics} from '../graphics';
import {MouseSystem} from './mouse.system';
import {SignalConnections} from 'typed-signals';
import {EventBusService, ICreateEntity} from '../services';

@Service()
export class EntityCreatorSystem extends EntitySystem {
    @Inject()
    private readonly mouseSystem!: MouseSystem;

    @Inject()
    private readonly eventBus!: EventBusService;

    private readonly connections = new SignalConnections();

    protected override onEnable(): void {
        this.connections.add(
            this.eventBus.createEntity.connect(this.createEntity.bind(this)),
        );
    }

    protected override onDisable(): void {
        this.connections.disconnectAll();
    }

    private createEntity(options: ICreateEntity): void {
        const blueprint = options.blueprint;

        if (blueprint.name === 'sticker') {
            const sticker = new Entity();
            this.engine.entities.add(sticker);

            sticker.add(new SelectableComponent());
            sticker.add(
                new PositionComponent(
                    options.position.x - blueprint.data.size.width / 2,
                    options.position.y - blueprint.data.size.height / 2,
                ),
            );
            sticker.add(
                new SizeComponent(
                    blueprint.data.size.width,
                    blueprint.data.size.height,
                ),
            );
            sticker.add(
                new GraphicsComponent(new StickerGraphics(sticker.getId())),
            );
        } else if (blueprint.name === 'selection') {
            const selection = new Entity();
            this.engine.entities.add(selection);

            selection.add(new SelectedComponent());
            selection.add(
                new PositionComponent(options.position.x, options.position.y),
            );
            selection.add(
                new SizeComponent(
                    blueprint.data.size.width,
                    blueprint.data.size.height,
                ),
            );
            selection.add(
                new GraphicsComponent(new SelectionGraphics(selection.getId())),
            );
        } else {
            throw new Error(`Not supported blueprint: ${blueprint}`);
        }
    }

    update(): void {}
}
