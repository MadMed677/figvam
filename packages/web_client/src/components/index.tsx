import React from 'react';

interface IToolbarSelectionItemProps {
    active: boolean;
    onClick: () => void;
}

export const ToolbarSelectionItem: React.FC<IToolbarSelectionItemProps> =
    props => (
        <div
            className={`app-footer__toolbar--vertical-holder--item ${
                props.active && 'app-footer__toolbar--item__active'
            }`}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
