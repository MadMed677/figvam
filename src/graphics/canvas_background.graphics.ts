import * as PIXI from 'pixi.js';
import {IGraphics} from './graphics.interface';

export interface ICanvasBackgroundGraphicsProps {
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
}

export class CanvasBackgroundGraphics
    implements IGraphics<ICanvasBackgroundGraphicsProps>
{
    private readonly id: number;
    readonly visual = new PIXI.Graphics();

    constructor(id: number) {
        this.id = id;
    }

    render(data: ICanvasBackgroundGraphicsProps): void {
        this.visual.x = data.position.x;
        this.visual.y = data.position.y;

        this.visual.hitArea = new PIXI.Rectangle(
            0,
            0,
            data.size.width,
            data.size.height,
        );
        this.visual.clear();
        this.visual.beginFill(0x7d99e3, 1);
        this.visual.drawRect(0, 0, data.size.width, data.size.height);
        this.visual.endFill();

        this.visual.name = String(this.id);

        this.visual.interactive = true;
    }
}
