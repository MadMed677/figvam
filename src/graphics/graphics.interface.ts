import * as PIXI from 'pixi.js';

export interface IGraphics<T> {
    readonly visual: PIXI.DisplayObject;
    render(data: T): void;
}
