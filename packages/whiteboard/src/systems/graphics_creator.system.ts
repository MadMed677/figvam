import {EntitySystem} from 'typed-ecstasy';
import {Inject, Service} from 'typedi';
import {EventBusService, PixiService} from '../services';
import {SignalConnections} from 'typed-signals';
import {IGraphics} from '../graphics';

@Service()
export class GraphicsCreatorSystem extends EntitySystem {
    @Inject()
    private readonly eventBus!: EventBusService;

    @Inject()
    private readonly pixiService!: PixiService;

    private readonly connections = new SignalConnections();

    protected override onEnable(): void {
        this.connections.add(
            this.eventBus.graphics.addToScene.connect(
                this.addToScene.bind(this),
            ),
        );
    }

    protected override onDisable(): void {
        this.connections.disconnectAll();
    }

    private addToScene(graphics: IGraphics<unknown>): void {
        this.pixiService.getViewportContainer().addChild(graphics.visual);
        // this.pixiService.getApplication().stage.addChild(graphics.visual);
    }

    update(): void {}
}
