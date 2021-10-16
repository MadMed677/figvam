import {Component} from 'typed-ecstasy';

export class VelocityComponent extends Component {
    public dx = 0;
    public dy = 0;

    constructor(dx: number, dy: number) {
        super();

        this.dx = dx;
        this.dy = dy;
    }
}
