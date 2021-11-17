import {Entity, EntitySystem} from 'typed-ecstasy';
import {Inject, Service} from 'typedi';
import {
    GraphicsComponent,
    PhysicsComponent,
    PositionComponent,
    SelectableComponent,
    SelectedComponent,
    SelectionComponent,
    SelectionToolComponent,
    SizeComponent,
} from '../components';
import {SignalConnections} from 'typed-signals';
import {EventBusService, ICreateEntity, PixiService} from '../services';

@Service()
export class EntityCreatorSystem extends EntitySystem {
    @Inject()
    private readonly eventBus!: EventBusService;

    private readonly connections = new SignalConnections();

    protected override onEnable(): void {
        this.connections.add(
            this.eventBus.entities.create.connect(this.createEntity.bind(this)),
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

            const graphics = new blueprint.graphics(sticker.getId());
            sticker.add(new SelectableComponent());
            sticker.add(new PhysicsComponent());
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
            sticker.add(new GraphicsComponent(graphics));

            /**
             * @todo I think it shouldn't be here. We have to process
             *  all visual components in one place and when something was added
             *  we have to add it into the stage
             * I think I have to implement some sort of queue and process
             *  all entered entities with graphics component
             */
            this.eventBus.graphics.addToScene.emit(graphics);
        } else if (blueprint.name === 'selection') {
            const selection = new Entity();
            this.engine.entities.add(selection);

            const graphics = new blueprint.graphics(selection.getId());
            selection.add(new SelectedComponent());
            selection.add(new SelectionComponent());
            selection.add(new SelectableComponent());
            selection.add(
                new PositionComponent(options.position.x, options.position.y),
            );
            selection.add(
                new SizeComponent(
                    blueprint.data.size.width,
                    blueprint.data.size.height,
                ),
            );
            selection.add(new GraphicsComponent(graphics));

            this.eventBus.graphics.addToScene.emit(graphics);
        } else if (blueprint.name === 'selection_tool') {
            const selectionTool = new Entity();
            this.engine.entities.add(selectionTool);

            const graphics = new blueprint.graphics(selectionTool.getId());
            selectionTool.add(
                new PositionComponent(options.position.x, options.position.y),
            );
            selectionTool.add(new PhysicsComponent());
            selectionTool.add(new SizeComponent(100, 100));
            selectionTool.add(new SelectionToolComponent());
            selectionTool.add(new GraphicsComponent(graphics));

            this.eventBus.graphics.addToScene.emit(graphics);
        } else {
            throw new Error(`Not supported blueprint: ${blueprint}`);
        }
    }

    update(): void {}
}
