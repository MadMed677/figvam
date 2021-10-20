import * as PIXI from 'pixi.js';
import {IGraphics} from './graphics.interface';

interface IStickerGraphicsProps {
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    mode: 'normal' | 'selected';
}

interface IStickerGraphicsStyle {
    background: number;
    line: number;
}

export class StickerGraphics implements IGraphics<IStickerGraphicsProps> {
    private readonly id: number;

    constructor(id: number) {
        this.id = id;
    }

    readonly visual = new PIXI.Graphics();

    private getStyle(
        mode: IStickerGraphicsProps['mode'],
    ): IStickerGraphicsStyle {
        switch (mode) {
            case 'normal': {
                return {
                    background: PIXI.utils.string2hex('#FCF3CF'),
                    line: PIXI.utils.string2hex('#F9E79F'),
                };
            }
            case 'selected': {
                return {
                    background: PIXI.utils.string2hex('#D5F5E3'),
                    line: PIXI.utils.string2hex('#ABEBC6'),
                };
            }
            default: {
                return {
                    background: PIXI.utils.string2hex('#FCF3CF'),
                    line: PIXI.utils.string2hex('#F9E79F'),
                };
            }
        }
    }

    render(data: IStickerGraphicsProps): void {
        const color = this.getStyle(data.mode);

        this.visual.lineStyle(2, color.line, 1);
        this.visual.beginFill(color.background);

        this.visual.x = data.position.x;
        this.visual.y = data.position.y;

        this.visual.drawRect(0, 0, data.size.width, data.size.height);

        this.visual.endFill();

        this.visual.interactive = true;
        this.visual.buttonMode = true;

        this.visual.name = String(this.id);

        this.visual.pivot.x = data.size.width / 2;
        this.visual.pivot.y = data.size.height / 2;
    }
}
