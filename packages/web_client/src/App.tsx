import React from 'react';
import './App.css';

import {FigvamFactory, Engine} from '@figvam/whiteboard';
import * as PIXI from 'pixi.js';

class App extends React.PureComponent<{}> {
    private engine!: Engine;
    private graphics!: PIXI.Application;

    constructor(props: {}) {
        super(props);

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        const {engine, graphics} = new FigvamFactory().create();

        this.engine = engine;
        this.graphics = graphics;

        this.graphics.ticker.add(this.tick);

        document
            .querySelector('#canvas_container')!
            .appendChild(this.graphics.view);
    }

    componentWillUnmount() {
        this.graphics.ticker.remove(this.tick);

        document
            .querySelector('#canvas_container')!
            .removeChild(this.graphics.view);
    }

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
            </div>
        );
    }
}

export default App;
