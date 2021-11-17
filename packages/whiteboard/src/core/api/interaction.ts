export enum InteractionTypes {
    Selection = 'selection',
    Creation = 'creation',
}

export enum SelectionSubType {
    /** Panning and Zooming on the Whiteboard. Without interaction with objects  */
    Hand = 'hand',

    /** Interaction mode. To select, drag, ... with objects  */
    Cursor = 'cursor',
}

export enum CreationSubType {
    /** An event to create `Sticker` object  */
    Sticker = 'sticker',

    /** An event to create `Shape` object  */
    Shape = 'shape',
}

export interface ISelectionMode {
    type: InteractionTypes.Selection;
    subType: SelectionSubType;
}

export interface ICreationMode {
    type: InteractionTypes.Creation;
    subType: CreationSubType;
}

export type InteractionMode = ISelectionMode | ICreationMode;

export class Interaction {
    private interactionMode: InteractionMode = {
        type: InteractionTypes.Selection,
        subType: SelectionSubType.Hand,
    };

    setMode(interactionMode: InteractionMode): void {
        this.interactionMode = interactionMode;
    }

    getMode(): InteractionMode {
        return this.interactionMode;
    }
}
