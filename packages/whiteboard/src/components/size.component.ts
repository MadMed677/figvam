import {Component} from 'typed-ecstasy';

export class SizeComponent extends Component {
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        super();

        this.width = width;
        this.height = height;
    }
}
