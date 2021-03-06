import {Service} from 'typedi';
import {Signal} from 'typed-signals';
import {Entity, ComponentConstructor} from 'typed-ecstasy';
import {IGraphics, GraphicsConstructor} from '../graphics';

interface IStickerData {
    name: 'sticker';
    data: {
        size: {
            width: number;
            height: number;
        };
    };
    graphics: GraphicsConstructor<IGraphics<unknown>>;
}

interface ISelectionToolData {
    name: 'selection';
    data: {
        size: {
            width: number;
            height: number;
        };
    };
    graphics: GraphicsConstructor<IGraphics<unknown>>;
}

interface ISelectionCreationToolData {
    name: 'selection_tool';
    data: {
        size: {
            width: number;
            height: number;
        };
    };
    graphics: GraphicsConstructor<IGraphics<unknown>>;
}

type IData = IStickerData | ISelectionToolData | ISelectionCreationToolData;

export interface ICreateEntity {
    position: {
        x: number;
        y: number;
    };
    blueprint: IData;
}

export interface ISelectEntity {
    position: {
        x: number;
        y: number;
    };
}

export interface IMoveEntities {
    position: {
        dx: number;
        dy: number;
    };
}

export interface ISelectionTool {
    state: 'start' | 'progress' | 'end';
    position: {
        x: number;
        y: number;
    };
}

@Service()
export class EventBusService {
    /** All operations on Entities */
    public readonly entities = {
        /** An event that triggers the creating of a new entity */
        create: new Signal<(options: ICreateEntity) => void>(),

        /** An event that triggers the destroying an entity */
        destroy: new Signal<(entity: Entity) => void>(),

        /** An event that triggers the destroying an entity by list of components */
        destroyByComponents: new Signal<
            (components: ComponentConstructor[]) => void
        >(),

        /** An event which triggers to select an entity */
        select: new Signal<(entity: Entity) => void>(),

        /** An event which triggers to deselect an entity */
        deselect: new Signal<(entity: Entity) => void>(),

        /** An event which triggers to change position of an entities */
        move: new Signal<
            (entities: Entity[], options: IMoveEntities) => void
        >(),
    };

    /** All operations on Graphics */
    public readonly graphics = {
        /** An event that triggers to assign Graphics into the Scene */
        addToScene: new Signal<(graphics: IGraphics<unknown>) => void>(),
    };

    /** An event which triggers to show selection tool */
    public readonly showSelectionTool = new Signal<
        (options: ISelectionTool) => void
    >();

    /**
     * An event which triggers to remove selection
     *  and remove `SelectedComponent` from all entities
     */
    public readonly removeSelection = new Signal<() => void>();
}
