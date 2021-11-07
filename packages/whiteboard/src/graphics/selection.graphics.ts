import * as PIXI from 'pixi.js';
import {IGraphics} from './graphics.interface';
import {IFigvamTheme} from '../services';

export interface ISelectionGraphicsProps {
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

export class SelectionGraphics implements IGraphics<ISelectionGraphicsProps> {
    private readonly id: number;
    private props!: ISelectionGraphicsProps;
    readonly visual = new PIXI.Graphics();

    constructor(id: number) {
        this.id = id;
    }

    public setProps(props: ISelectionGraphicsProps): void {
        this.props = props;
    }

    public shouldComponentUpdate(nextProps: ISelectionGraphicsProps): boolean {
        // If it's a first render
        if (!this.props) {
            return true;
        }

        return (
            nextProps.position.x !== this.props.position.x ||
            nextProps.position.y !== this.props.position.y ||
            nextProps.size.width !== this.props.size.width ||
            nextProps.size.height !== this.props.size.height ||
            nextProps.theme !== this.props.theme
        );
    }

    public render(): void {
        this.visual.clear();

        this.visual.x = this.props.position.x;
        this.visual.y = this.props.position.y;

        this.visual.lineStyle(4, this.props.theme.border.default);
        this.visual.hitArea = new PIXI.Rectangle(
            0,
            0,
            this.props.size.width,
            this.props.size.height,
        );
        // this.visual.beginFill(this.props.theme.bgColor.accent, 0.1);
        this.visual.drawRect(
            0,
            0,
            this.props.size.width,
            this.props.size.height,
        );
        this.visual.endFill();

        this.visual.interactive = true;
        this.visual.buttonMode = false;

        this.visual.name = String(this.id);
    }

    public destroy(): void {
        this.visual.destroy();
    }
}
