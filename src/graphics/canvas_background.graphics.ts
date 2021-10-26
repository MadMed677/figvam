import * as PIXI from 'pixi.js';
import {IGraphics} from './graphics.interface';
import {IFigvamTheme} from '../services';

export interface ICanvasBackgroundGraphicsProps {
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    theme: IFigvamTheme;
}

export class CanvasBackgroundGraphics
    implements IGraphics<ICanvasBackgroundGraphicsProps>
{
    private readonly id: number;
    private props!: ICanvasBackgroundGraphicsProps;
    readonly visual = new PIXI.Graphics();

    constructor(id: number) {
        this.id = id;
    }

    public setProps(props: ICanvasBackgroundGraphicsProps): void {
        this.props = props;
    }

    public shouldComponentUpdate(
        nextProps: ICanvasBackgroundGraphicsProps,
    ): boolean {
        // If it's a first render
        if (!this.props) {
            return true;
        }

        return nextProps.theme !== this.props.theme;
    }

    render(): void {
        this.visual.x = this.props.position.x;
        this.visual.y = this.props.position.y;

        this.visual.hitArea = new PIXI.Rectangle(
            0,
            0,
            this.props.size.width,
            this.props.size.height,
        );
        this.visual.clear();
        this.visual.beginFill(this.props.theme.bgColor.default);
        this.visual.drawRect(
            0,
            0,
            this.props.size.width,
            this.props.size.height,
        );
        this.visual.endFill();

        this.visual.name = String(this.id);

        this.visual.interactive = true;
    }
}
