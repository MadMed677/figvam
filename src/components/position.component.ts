import {Component} from 'typed-ecstasy';

export class PositionComponent extends Component {
    public x = 0;
    public y = 0;

    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;
    }
}
