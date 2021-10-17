import * as PIXI from 'pixi.js';
import {IGraphics} from './graphics.interface';

interface IStickerGraphicsVisualize {
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
}

export class StickerGraphics implements IGraphics<IStickerGraphicsVisualize> {
    readonly visual = new PIXI.Graphics();

    render(data: IStickerGraphicsVisualize): void {
        this.visual.lineStyle(2, 0xdfcf8b, 1);
        this.visual.beginFill(0xf3f374);

        this.visual.x = data.position.x;
        this.visual.y = data.position.y;

        this.visual.drawRect(0, 0, data.size.width, data.size.height);

        this.visual.endFill();

        this.visual.interactive = true;
        this.visual.buttonMode = true;

        this.visual.pivot.x = data.size.width / 2;
        this.visual.pivot.y = data.size.height / 2;
    }
}
