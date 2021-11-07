import * as PIXI from 'pixi.js';
import {IGraphics} from './graphics.interface';
import {IFigvamTheme} from '../services';

export interface ISelectionToolGraphicsProps {
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

export class SelectionToolGraphics
    implements IGraphics<ISelectionToolGraphicsProps>
{
    private readonly id: number;
    private props!: ISelectionToolGraphicsProps;
    readonly visual = new PIXI.Graphics();

    constructor(id: number) {
        this.id = id;
    }

    public setProps(props: ISelectionToolGraphicsProps): void {
        this.props = props;
    }

    public shouldComponentUpdate(
        nextProps: ISelectionToolGraphicsProps,
    ): boolean {
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

    render(): void {
        this.visual.x = this.props.position.x;
        this.visual.y = this.props.position.y;

        this.visual.clear();

        this.visual.lineStyle(1, this.props.theme.border.default);
        this.visual.beginFill(this.props.theme.border.default, 0.1);
        this.visual.drawRect(
            0,
            0,
            this.props.size.width,
            this.props.size.height,
        );
        this.visual.endFill();

        this.visual.name = String(this.id);
    }

    destroy(): void {
        this.visual.destroy();
    }
}
