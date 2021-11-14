import {Service} from 'typedi';
import {Signal} from 'typed-signals';
import {Entity, ComponentConstructor} from 'typed-ecstasy';

interface IStickerData {
    name: 'sticker';
    data: {
        size: {
            width: number;
            height: number;
        };
    };
}

interface ISelectionToolData {
    name: 'selection';
    data: {
        size: {
            width: number;
            height: number;
        };
    };
}

interface ISelectionCreationToolData {
    name: 'selection_tool';
    data: {
        size: {
            width: number;
            height: number;
        };
    };
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
    /** An event that triggers the creating of a new entity */
    public readonly createEntity = new Signal<
        (options: ICreateEntity) => void
    >();

    /** An event that triggers the destroying an entity */
    public readonly destroyEntity = new Signal<(entity: Entity) => void>();

    /** An event that triggers the destroying an entity by list of components */
    public readonly destroyEntityByComponents = new Signal<
        (components: ComponentConstructor[]) => void
    >();

    /** An event which triggers to select an entity */
    public readonly selectEntity = new Signal<(entity: Entity) => void>();

    /** An event which triggers to deselect an entity */
    public readonly deselectEntity = new Signal<(entity: Entity) => void>();

    /** An event which triggers move entities */
    public readonly moveEntities = new Signal<
        (entities: Entity[], options: IMoveEntities) => void
    >();

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
