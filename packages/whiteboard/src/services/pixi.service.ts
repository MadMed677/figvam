import {Service} from 'typedi';
import * as PIXI from 'pixi.js';

@Service()
export class PixiService {
    private readonly application = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    constructor() {
        window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
            window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({
                PIXI: PIXI,
            });
    }

    public getApplication(): PIXI.Application {
        return this.application;
    }
}
