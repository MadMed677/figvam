import React from 'react';
import './App.css';

import Keyboard from 'keyboardjs';

import {Engine, FigvamApi, InteractionMode} from '@figvam/whiteboard';
import * as PIXI from 'pixi.js';

import {Footer} from './Footer';

import {CreationItem, SelectionItem} from './types/toolbar.types';
import {
    CreationSubType,
    InteractionTypes,
    SelectionSubType,
} from '@figvam/whiteboard/types';

interface IApplicationProps {
    engine: Engine;
    graphics: PIXI.Application;
    api: FigvamApi;
}

interface IApplicationState {
    selectionItems: Array<SelectionItem>;
    creationItems: Array<CreationItem>;
}

class App extends React.PureComponent<IApplicationProps, IApplicationState> {
    constructor(props: IApplicationProps) {
        super(props);

        this.state = {
            selectionItems: [
                {
                    type: SelectionSubType.Cursor,
                    active: true,
                },
                {
                    type: SelectionSubType.Hand,
                    active: false,
                },
            ],
            creationItems: [
                {
                    type: CreationSubType.Sticker,
                    active: false,
                },
                {
                    type: CreationSubType.Shape,
                    active: false,
                },
            ],
        };

        this.setInteractionWhiteboardMode({
            type: InteractionTypes.Selection,
            subType: SelectionSubType.Cursor,
        });

        this.tick = this.tick.bind(this);
    }

    private setInteractionWhiteboardMode = (
        interactionMode: InteractionMode,
    ): void => {
        this.props.api.interaction.setMode(interactionMode);
    };

    private onSelectionItemClicked = (type: 'cursor' | 'hand'): void => {
        const updatedSelectionItems = this.state.selectionItems.map(item => {
            if (type !== item.type) {
                return {
                    ...item,
                    active: false,
                };
            }

            this.props.api.interaction.setMode({
                type: InteractionTypes.Selection,
                subType:
                    type === 'hand'
                        ? SelectionSubType.Hand
                        : SelectionSubType.Cursor,
            });

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

            this.props.api.interaction.setMode({
                type: InteractionTypes.Creation,
                subType:
                    type === 'sticker'
                        ? CreationSubType.Sticker
                        : CreationSubType.Shape,
            });

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

    componentDidMount() {
        this.initShortcuts();
        this.props.graphics.ticker.add(this.tick);

        const canvasContainer = document.querySelector('#canvas_container')!;

        /**
         * If Pixi App already registered inside DOM then we do nothing
         *  otherwise we have to add it
         */
        if (!canvasContainer.hasChildNodes()) {
            document
                .querySelector('#canvas_container')!
                .appendChild(this.props.graphics.view);
        }
    }

    componentWillUnmount() {
        /** Unbind all keyboard listeners */
        Keyboard.reset();

        this.props.graphics.ticker.remove(this.tick);

        document
            .querySelector('#canvas_container')!
            .removeChild(this.props.graphics.view);
    }

    private initShortcuts = (): void => {
        /** Select selection tool */
        Keyboard.bind('v', e => {
            this.onSelectionItemClicked('cursor');
        });

        /** Select hard tool */
        Keyboard.bind('h', e => {
            this.onSelectionItemClicked('hand');
        });

        /** Select Sticker Note tool */
        Keyboard.bind('n', e => {
            this.onCreationItemClicked('sticker');
        });

        /** Select Shape tool */
        Keyboard.bind('s', e => {
            this.onCreationItemClicked('shape');
        });
    };

    private tick() {
        this.props.engine.update(
            Math.min(0.032, this.props.graphics.ticker.elapsedMS / 1000),
        );
    }

    render() {
        return (
            <div className="app">
                <div id="canvas_container" />
                <div className="app-header">
                    <div className="app-header__menu-button">
                        <span onClick={console.log}>FV</span>
                    </div>
                </div>
                <Footer
                    creationItems={this.state.creationItems}
                    selectionItems={this.state.selectionItems}
                    onClick={data => {
                        if (data.type === 'selection') {
                            this.onSelectionItemClicked(data.subType);
                        } else {
                            this.onCreationItemClicked(data.subType);
                        }
                    }}
                />
            </div>
        );
    }
}

export default App;
