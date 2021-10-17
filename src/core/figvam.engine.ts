import {Engine, Entity} from 'typed-ecstasy';
import {SystemConstructor} from 'typed-ecstasy/dist/core/AbstractSystem';
import {EntitySystem} from 'typed-ecstasy/dist/core/EntitySystem';

type PublicConstructor<T> = new () => T;

interface IEngineBuilder {
    withSystem<T extends EntitySystem>(
        system: SystemConstructor<T>,
    ): IEngineBuilder;
    withEntity(entity: Entity): IEngineBuilder;
    build(): Engine;
}

export class FigvamEngine {
    public static getBuilder(): IEngineBuilder {
        return new (this.builder())();
    }

    private static builder(): PublicConstructor<IEngineBuilder> {
        return class BuilderConstructor implements IEngineBuilder {
            private engine = new Engine();

            public withSystem<T extends EntitySystem>(
                system: SystemConstructor<T>,
            ): IEngineBuilder {
                this.engine.systems.add(system);

                return this;
            }

            public withEntity(entity: Entity): IEngineBuilder {
                this.engine.entities.add(entity);

                return this;
            }

            public build(): Engine {
                return this.engine;
            }
        };
    }
}
