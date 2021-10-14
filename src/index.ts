import '@abraham/reflection';

import {engine} from './core/engine';

type CallbackFunction = (time: number, frame: number) => void;

class RenderService {
    private fps: number;
    private callback: CallbackFunction;
    private delay: number;
    private time: number | undefined;
    private frame: number;
    private tref: number | undefined;
    private isRunning: boolean;

    constructor(fps: number, callback: CallbackFunction) {
        this.fps = fps;
        this.callback = callback;

        this.delay = 1000 / fps;
        this.time = undefined;
        this.frame = -1;
        this.tref = undefined;
        this.isRunning = false;

        this.loop = this.loop.bind(this);
    }

    private loop(timestamp: number): void {
        if (this.time === undefined) {
            this.time = timestamp;
        }

        const seg = Math.floor((timestamp - this.time) / this.delay);

        if (seg > this.frame) {
            this.frame = seg;
            this.callback(timestamp, this.frame);
        }

        this.tref = requestAnimationFrame(this.loop);
    }

    public start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.tref = requestAnimationFrame(this.loop);
        }
    }
}

const fc = new RenderService(1, time => {
    engine.update(time);
});

fc.start();
