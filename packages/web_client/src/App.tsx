import React from 'react';
import './App.css';

import {Engine} from '@figvam/whiteboard';
import * as PIXI from 'pixi.js';

interface IApplicationProps {
    engine: Engine;
    graphics: PIXI.Application;
}

class App extends React.PureComponent<IApplicationProps> {
    constructor(props: IApplicationProps) {
        super(props);

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
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
        this.props.graphics.ticker.remove(this.tick);

        document
            .querySelector('#canvas_container')!
            .removeChild(this.props.graphics.view);
    }

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
            </div>
        );
    }
}

export default App;
