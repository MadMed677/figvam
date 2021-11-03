import {Inject, Service} from 'typedi';
import {Entity, EntitySystem} from 'typed-ecstasy';
import {
    SelectedComponent,
    DragComponent,
    SelectableComponent,
} from '../components';
import {IDragOptions, MouseSystem} from './mouse.system';

@Service()
export class ObjectSelectorSystem extends EntitySystem {
    @Inject()
    mouseSystem!: MouseSystem;

    protected override onEnable(): void {
        this.mouseSystem.onClick.connect(
            ObjectSelectorSystem.onClickEventHandler,
        );
        this.mouseSystem.onDrag.connect(
            ObjectSelectorSystem.onDragEventHandler,
        );
    }

    protected override onDisable(): void {
        this.mouseSystem.onClick.disconnect(
            ObjectSelectorSystem.onClickEventHandler,
        );
        this.mouseSystem.onDrag.disconnect(
            ObjectSelectorSystem.onDragEventHandler,
        );
    }

    private static onClickEventHandler(entity: Entity) {
        /**
         * We don't need to react on any entities
         *  which hasn't "SelectableComponent"
         */
        if (!entity.get(SelectableComponent)) {
            return;
        }

        if (entity.get(SelectedComponent)) {
            entity.remove(SelectedComponent);
        } else {
            entity.add(new SelectedComponent());
        }
    }

    private static onDragEventHandler(entity: Entity, options: IDragOptions) {
        /**
         * We don't need to react on any entities
         *  which hasn't "SelectableComponent"
         */
        if (!entity.get(SelectableComponent)) {
            return;
        }

        switch (options.state) {
            case 'start': {
                entity.add(
                    new DragComponent(options.position.x, options.position.y),
                );

                return;
            }
            case 'progress': {
                const dragComponent = entity.require(DragComponent);

                dragComponent.x = options.position.x;
                dragComponent.y = options.position.y;

                return;
            }
            case 'end': {
                entity.remove(DragComponent);

                return;
            }
            default: {
                throw new Error('Entity does not have DragComponent');
            }
        }
    }

    update(): void {}
}
