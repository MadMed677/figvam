import {Component} from 'typed-ecstasy';

export class DragComponent extends Component {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;
    }
}
