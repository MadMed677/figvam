import React from 'react';
import './App.css';

import Keyboard from 'keyboardjs';

import {
    Engine,
    FigvamApi,
    InteractionMode,
    FigvamFactory,
} from '@figvam/whiteboard';
import * as PIXI from 'pixi.js';

import {Footer} from './Footer';

import {CreationItem, SelectionItem} from './types/toolbar.types';
import {
    CreationSubType,
    InteractionTypes,
    SelectionSubType,
} from '@figvam/whiteboard/types';
import {log} from 'util';

interface IApplicationProps {}

interface IApplicationState {
    selectionItems: Array<SelectionItem>;
    creationItems: Array<CreationItem>;
}

class App extends React.PureComponent<IApplicationProps, IApplicationState> {
    private readonly engine: Engine;
    private readonly graphics: PIXI.Application;
    private readonly api: FigvamApi;

    constructor(props: IApplicationProps) {
        super(props);

        console.warn('constructor has been called');

        const figvamWhiteboard = new FigvamFactory().create();

        this.engine = figvamWhiteboard.engine;
        this.graphics = figvamWhiteboard.graphics;
        this.api = figvamWhiteboard.api;

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
        this.api.interaction.setMode(interactionMode);
    };

    private onSelectionItemClicked = (type: SelectionSubType): void => {
        const updatedSelectionItems = this.state.selectionItems.map(item => {
            if (type !== item.type) {
                return {
                    ...item,
                    active: false,
                };
            }

            this.api.interaction.setMode({
                type: InteractionTypes.Selection,
                subType: type,
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

    private onCreationItemClicked = (type: CreationSubType): void => {
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

            this.api.interaction.setMode({
                type: InteractionTypes.Creation,
                subType: type,
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
        console.warn('did mount?');

        // @ts-ignore
        if (module.hot) {
            console.log('its hot');
            // @ts-ignore
            module.hot.accept('@figvam/whiteboard', () => {
                console.log(
                    'something has been changed in: @figvam/whiteboard',
                );
            });
        }

        import('whiteboard_engine').then(module => {
            console.log(module.greet());
        });

        this.initShortcuts();
        this.graphics.ticker.add(this.tick);

        const canvasContainer = document.querySelector('#canvas_container')!;

        /**
         * If Pixi App already registered inside DOM then we do nothing
         *  otherwise we have to add it
         */
        if (!canvasContainer.hasChildNodes()) {
            canvasContainer.appendChild(this.graphics.view);
        }
    }

    componentWillUnmount() {
        console.warn('will unmount? ');

        /** Unbind all keyboard listeners */
        Keyboard.reset();

        this.graphics.ticker.remove(this.tick);

        const canvasContainer = document.querySelector('#canvas_container')!;

        while (canvasContainer.firstChild) {
            canvasContainer.removeChild(canvasContainer.firstChild);
        }
    }

    private initShortcuts = (): void => {
        /** Select selection tool */
        Keyboard.bind('v', _ => {
            this.onSelectionItemClicked(SelectionSubType.Cursor);
        });

        /** Select hard tool */
        Keyboard.bind('h', _ => {
            this.onSelectionItemClicked(SelectionSubType.Hand);
        });

        /** Select Sticker Note tool */
        Keyboard.bind('n', _ => {
            this.onCreationItemClicked(CreationSubType.Sticker);
        });

        /** Select Shape tool */
        Keyboard.bind('s', _ => {
            this.onCreationItemClicked(CreationSubType.Shape);
        });
    };

    private tick() {
        this.engine.update(
            Math.min(0.032, this.graphics.ticker.elapsedMS / 1000),
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
                        if (data.type === InteractionTypes.Selection) {
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
