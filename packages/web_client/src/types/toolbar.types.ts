import {CreationSubType, SelectionSubType} from '@figvam/whiteboard/types';

/** Canvas Interaction */
export interface SelectionItem {
    /**
     * Interaction type. It might be
     *  - hand - canvas navigation. All clicks by whiteboard will be avoided except moving
     *  - cursor - default mode. Clicks will be transmitted to Canvas
     */
    type: SelectionSubType;

    /** Is current item active or not */
    active: boolean;
}

/** Canvas Creation */
export interface CreationItem {
    /**
     * Creating type. It might be
     *  - sticker - create `sticker` entity on whiteboard
     *  - shape - Not supported yet
     */
    type: CreationSubType;

    /** Is current item active or not */
    active: boolean;
}
