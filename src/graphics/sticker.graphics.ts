import * as PIXI from 'pixi.js';

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

export class StickerGraphics extends PIXI.Graphics {
    visualize(data: IStickerGraphicsVisualize): void {
        console.warn('[StickerGraphics] visualize');

        this.lineStyle(2, 0xdfcf8b, 1);
        this.beginFill(0xf3f374);

        this.x = data.position.x;
        this.y = data.position.y;

        this.drawRect(0, 0, data.size.width, data.size.height);

        this.endFill();

        this.interactive = true;
        this.buttonMode = true;

        this.pivot.x = data.size.width / 2;
        this.pivot.y = data.size.height / 2;
    }
}
