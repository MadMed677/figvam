import {Component} from 'typed-ecstasy';
import {IGraphics} from '../graphics';

export class GraphicsComponent<T> extends Component {
    public visual: IGraphics<T>;

    constructor(graphics: IGraphics<T>) {
        super();

        this.visual = graphics;
    }
}
