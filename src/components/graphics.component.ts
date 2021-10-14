import * as PIXI from 'pixi.js';
import {Component} from 'typed-ecstasy';

interface IBasicVisualize {
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
}

export interface IGraphics extends PIXI.DisplayObject {
    visualize(data: IBasicVisualize): void;
}

export class GraphicsComponent extends Component {
    public graphics: IGraphics;

    constructor(graphics: IGraphics) {
        super();

        this.graphics = graphics;
    }
}
