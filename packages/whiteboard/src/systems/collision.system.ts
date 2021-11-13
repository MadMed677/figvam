import {Family, IteratingSystem, Entity} from 'typed-ecstasy';
import {
    GraphicsComponent,
    PhysicsComponent,
    PositionComponent,
    SelectionToolComponent,
    SizeComponent,
} from '../components';
import {Inject, Service} from 'typedi';
import {EventBusService} from '../services';

interface ICoord {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

@Service()
export class CollisionSystem extends IteratingSystem {
    @Inject()
    private readonly eventBus!: EventBusService;

    constructor() {
        super(
            Family.all(
                PositionComponent,
                SizeComponent,
                GraphicsComponent,
                PhysicsComponent,
            ).get(),
        );
    }

    protected override processEntity(selectionTool: Entity): void {
        /** Process only "SelectionToolComponent" */
        if (!selectionTool.has(SelectionToolComponent)) {
            return;
        }

        const position = selectionTool.require(PositionComponent);
        const size = selectionTool.require(SizeComponent);
        const allEntities = this.getEntities();

        for (const entity of allEntities) {
            if (entity === selectionTool) {
                continue;
            }

            const entPosition = entity.require(PositionComponent);
            const entSize = entity.require(SizeComponent);

            const selectionX1 = position.x;
            const selectionX2 = position.x + size.width;
            const selectionY1 = position.y;
            const selectionY2 = position.y + size.height;

            const entityX1 = entPosition.x;
            const entityX2 = entPosition.x + entSize.width;
            const entityY1 = entPosition.y;
            const entityY2 = entPosition.y + entSize.height;

            const collided = this.testCollision(
                {
                    x1: selectionX1 <= selectionX2 ? selectionX1 : selectionX2,
                    y1: selectionY1 <= selectionY2 ? selectionY1 : selectionY2,
                    x2: selectionX1 <= selectionX2 ? selectionX2 : selectionX1,
                    y2: selectionY1 <= selectionY2 ? selectionY2 : selectionY1,
                },
                {
                    x1: entityX1,
                    y1: entityY1,
                    x2: entityX2,
                    y2: entityY2,
                },
            );

            if (collided) {
                this.eventBus.selectEntity.emit(entity);
            } else {
                this.eventBus.deselectEntity.emit(entity);
            }
        }
    }

    private testCollision(entity1: ICoord, entity2: ICoord): boolean {
        return (
            entity1.x2 >= entity2.x1 &&
            entity1.y2 >= entity2.y1 &&
            entity1.x1 <= entity2.x2 &&
            entity1.y1 <= entity2.y2
        );
    }
}
