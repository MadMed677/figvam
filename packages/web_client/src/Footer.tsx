import React from 'react';
import './Footer.css';

import {ToolbarSelectionItem, ToolbarCreationItem} from './components';

/** Canvas Interaction */
interface SelectionItem {
    /**
     * Interaction type. It might be
     *  - hand - canvas navigation. All clicks by whiteboard will be avoided except moving
     *  - cursor - default mode. Clicks will be transmitted to Canvas
     */
    type: 'hand' | 'cursor';

    /** Is current item active or not */
    active: boolean;
}

/** Canvas Creation */
interface CreationItem {
    /**
     * Creating type. It might be
     *  - sticker - create `sticker` entity on whiteboard
     *  - shape - Not supported yet
     */
    type: 'sticker' | 'shape';

    /** Is current item active or not */
    active: boolean;
}

interface IFooterProps {}
interface IFooterState {
    selectionItems: Array<SelectionItem>;
    creationItems: Array<CreationItem>;
}

export class Footer extends React.PureComponent<IFooterProps, IFooterState> {
    constructor(props: IFooterProps) {
        super(props);

        this.state = {
            selectionItems: [
                {
                    type: 'cursor',
                    active: true,
                },
                {
                    type: 'hand',
                    active: false,
                },
            ],
            creationItems: [
                {
                    type: 'sticker',
                    active: false,
                },
                {
                    type: 'shape',
                    active: false,
                },
            ],
        };
    }

    private onSelectionItemClicked = (type: 'cursor' | 'hand'): void => {
        const updatedSelectionItems = this.state.selectionItems.map(item => {
            if (type !== item.type) {
                return {
                    ...item,
                    active: false,
                };
            }

            return {
                ...item,
                active: true,
            };
        });

        const updatedCreationItems = this.state.creationItems.map(item => ({
            ...item,
            active: false,
        }));

        this.setState({
            selectionItems: updatedSelectionItems,
            creationItems: updatedCreationItems,
        });
    };

    private onCreationItemClicked = (type: 'shape' | 'sticker'): void => {
        const updatedSelectionItems = this.state.selectionItems.map(item => ({
            ...item,
            active: false,
        }));

        const updatedCreationItems = this.state.creationItems.map(item => {
            if (type !== item.type) {
                return {
                    ...item,
                    active: false,
                };
            }

            return {
                ...item,
                active: true,
            };
        });

        this.setState({
            creationItems: updatedCreationItems,
            selectionItems: updatedSelectionItems,
        });
    };

    render() {
        return (
            <div className="app-footer">
                <div className="app-footer__toolbar">
                    <div className="app-footer__toolbar--vertical-holder">
                        {this.state.selectionItems.map(item => (
                            <ToolbarSelectionItem
                                key={item.type}
                                type={item.type}
                                onClick={this.onSelectionItemClicked}
                                active={item.active}
                            />
                        ))}
                    </div>
                    <div className="app-footer__divider" />
                    <div className="app-footer__toolbar--horizontal-holder">
                        {this.state.creationItems.map(item => (
                            <ToolbarCreationItem
                                key={item.type}
                                type={item.type}
                                onClick={this.onCreationItemClicked}
                                active={item.active}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
