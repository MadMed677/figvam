import React from 'react';
import './Footer.css';
import {
    ICreationMode,
    InteractionTypes,
    ISelectionMode,
} from '@figvam/whiteboard/types';

import {ToolbarCreationItem, ToolbarSelectionItem} from './components';
import {CreationItem, SelectionItem} from './types/toolbar.types';

type IClick = ICreationMode | ISelectionMode;

interface IFooterProps {
    onClick(data: IClick): void;
    selectionItems: Array<SelectionItem>;
    creationItems: Array<CreationItem>;
}

export class Footer extends React.PureComponent<IFooterProps> {
    private onSelectionClick = (item: SelectionItem['type']): void => {
        this.props.onClick({
            type: InteractionTypes.Selection,
            subType: item,
        });
    };

    private onCreationClick = (item: CreationItem['type']): void => {
        this.props.onClick({
            type: InteractionTypes.Creation,
            subType: item,
        });
    };

    render() {
        return (
            <div className="app-footer">
                <div className="app-footer__toolbar">
                    <div className="app-footer__toolbar--vertical-holder">
                        {this.props.selectionItems.map(item => (
                            <ToolbarSelectionItem
                                key={item.type}
                                type={item.type}
                                onClick={this.onSelectionClick}
                                active={item.active}
                            />
                        ))}
                    </div>
                    <div className="app-footer__divider" />
                    <div className="app-footer__toolbar--horizontal-holder">
                        {this.props.creationItems.map(item => (
                            <ToolbarCreationItem
                                key={item.type}
                                type={item.type}
                                onClick={this.onCreationClick}
                                active={item.active}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
