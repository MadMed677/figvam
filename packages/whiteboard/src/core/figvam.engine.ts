import {Engine, Entity, EntitySystem, SystemConstructor} from 'typed-ecstasy';
import {PixiService} from '../services';
import {GraphicsComponent} from '../components';

type PublicConstructor<T> = new () => T;

interface IEngineBuilder {
    withSystem<T extends EntitySystem>(
        system: SystemConstructor<T>,
    ): IEngineBuilder;
    withEntity(entityBuilder: (entity: Entity) => void): IEngineBuilder;
    build(): Engine;
}

export class FigvamEngine {
    public static getBuilder(): IEngineBuilder {
        return new (this.builder())();
    }

    private static builder(): PublicConstructor<IEngineBuilder> {
        return class BuilderConstructor implements IEngineBuilder {
            private engine = new Engine();

            /**
             * The priority to execute this system with
             * The lower the priority level, the sooner the system will be updated
             *
             * @link https://lusito.github.io/typed-ecstasy/guide/core/entitysystem.html#updating-all-systems
             *
             * @private
             */
            private systemOrder = 1;

            public withSystem<T extends EntitySystem>(
                system: SystemConstructor<T>,
            ): IEngineBuilder {
                this.engine.systems.add(system, this.systemOrder++);

                return this;
            }

            public withEntity(
                entityBuilder: (entity: Entity) => void,
            ): IEngineBuilder {
                const entity = new Entity();
                this.engine.entities.add(entity);
                const pixiService = this.engine.getContainer().get(PixiService);

                entityBuilder(entity);

                const graphics = entity.get(GraphicsComponent);

                if (graphics) {
                    pixiService
                        .getApplication()
                        .stage.addChild(graphics.visual.visual);
                }

                return this;
            }

            public build(): Engine {
                return this.engine;
            }
        };
    }
}
