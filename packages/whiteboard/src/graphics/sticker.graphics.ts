import * as PIXI from 'pixi.js';
import {IGraphics} from './graphics.interface';
import {IFigvamTheme} from '../services';

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

    constructor(id: number) {
        this.id = id;

        this.visual.addChild(this.text);
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

    render(): void {
        const color =
            this.props.mode === 'selected'
                ? {
                      bgColor: this.props.theme.bgColor.accent,
                      border: this.props.theme.border.accent,
                  }
                : {
                      bgColor: this.props.theme.bgColor.primary,
                      border: this.props.theme.border.primary,
                  };

        this.visual.clear();

        this.visual.lineStyle(2, color.border);
        this.visual.beginFill(color.bgColor);

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

        this.visual.pivot.x = this.props.size.width / 2;
        this.visual.pivot.y = this.props.size.height / 2;

        this.text.text = this.props.text || '';
    }
}
