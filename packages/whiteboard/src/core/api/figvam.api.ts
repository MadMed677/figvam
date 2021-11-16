import {Service} from 'typedi';

import {Interaction} from './interaction';

@Service()
export class FigvamApi {
    interaction = new Interaction();
}
