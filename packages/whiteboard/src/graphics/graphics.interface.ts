import * as PIXI from 'pixi.js';

export interface IGraphics<T> {
    readonly visual: PIXI.DisplayObject;
    shouldComponentUpdate(nextProps: T): boolean;
    setProps(props: T): void;
    render(): void;
    destroy?(): void;
}
