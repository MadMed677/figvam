import * as PIXI from 'pixi.js';
import {IGraphics} from './graphics.interface';
import {IFigvamTheme} from '../services';
import {DropShadowFilter} from 'pixi-filters';

export interface IStickerGraphicsProps {
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    theme: IFigvamTheme;
    mode: 'normal' | 'selected';
    text?: string;
}

export class StickerGraphics implements IGraphics<IStickerGraphicsProps> {
    private readonly id: number;
    private props!: IStickerGraphicsProps;

    /** Pixi Primitives */
    readonly visual = new PIXI.Graphics();
    private readonly text = new PIXI.Text('', {
        fontSize: 16,
        wordWrap: true,
        wordWrapWidth: 100,
        align: 'center',
    });
    private readonly selection = new PIXI.Graphics();
    private readonly shadow = new DropShadowFilter();

    constructor(id: number) {
        this.id = id;

        this.visual.addChild(this.text);

        this.visual.filters = [this.shadow];
    }

    public setProps(props: IStickerGraphicsProps): void {
        this.props = props;
    }

    public shouldComponentUpdate(nextProps: IStickerGraphicsProps): boolean {
        // If it's a first render
        if (!this.props) {
            return true;
        }

        return (
            nextProps.position.x !== this.props.position.x ||
            nextProps.position.y !== this.props.position.y ||
            nextProps.size.width !== this.props.size.width ||
            nextProps.size.height !== this.props.size.height ||
            nextProps.mode !== this.props.mode ||
            nextProps.text !== this.props.text ||
            nextProps.theme !== this.props.theme
        );
    }

    private drawSelection(): void {
        // Stroke of line border width
        const strokeWidth = 4;

        // Offset of the visual in pixels
        const offset = 4 + strokeWidth;

        this.selection.clear();
        this.selection.lineStyle(
            strokeWidth,
            this.props.theme.border.default,
            0.7,
        );
        this.selection.drawRect(
            // Shift by `x` axes
            -offset,

            // Shift by `y` axes
            -offset,

            /**
             * Add the same size of visual but cover the shifts
             *  from left and right sides
             */
            this.props.size.width + offset * 2,
            this.props.size.height + offset * 2,
        );
        this.selection.endFill();
    }

    private drawShadow(): void {
        const distanceRatio = 10;

        this.shadow.color = this.props.theme.shadow.default;
        this.shadow.alpha = 0.1;
        this.shadow.blur = 6;

        // 1.22rad = 70 degree
        // this.shadow.angle = 1.22;
        // this.shadow.angle = 1.53;
        this.shadow.angle = 1.4;
        // this.shadow.quality = 20;
        // this.shadow.pixelSize = 1;
        this.shadow.distance = this.props.size.width / distanceRatio;
    }

    render(): void {
        this.visual.clear();

        this.visual.beginFill(this.props.theme.bgColor.primary);

        this.visual.x = this.props.position.x;
        this.visual.y = this.props.position.y;

        this.visual.drawRect(
            0,
            0,
            this.props.size.width,
            this.props.size.height,
        );

        this.visual.endFill();

        this.visual.interactive = true;
        this.visual.buttonMode = true;

        this.visual.name = String(this.id);

        this.text.text = this.props.text || '';

        if (this.props.mode === 'selected') {
            this.visual.addChild(this.selection);
        } else if (this.props.mode === 'normal') {
            this.visual.removeChild(this.selection);
        }

        this.drawSelection();
        this.drawShadow();
    }
}
