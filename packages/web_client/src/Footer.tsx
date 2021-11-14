import React from 'react';
import './Footer.css';

import {ToolbarSelectionItem} from './components';

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
    type: 'creation';

    /**
     * Creating type. It might be
     *  - sticker - create `sticker` entity on whiteboard
     *  - shape - Not supported yet
     */
    subType: 'sticker' | 'shape';

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
            creationItems: [],
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

        this.setState({
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
                                type={item.type}
                                onClick={this.onSelectionItemClicked}
                                active={item.active}
                            />
                        ))}
                    </div>
                    <div className="app-footer__divider" />
                    <div className="app-footer__toolbar--horizontal-holder">
                        <div className="app-footer__toolbar--horizontal-holder--item">
                            <svg
                                height="144"
                                width="144"
                                viewBox="0 0 144 144"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="72" cy="72" r="56"></circle>
                            </svg>
                        </div>
                        <div className="app-footer__toolbar--horizontal-holder--item">
                            <svg
                                height="144"
                                width="144"
                                viewBox="0 0 144 144"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect x="10" y="20" width="124" height="124" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
