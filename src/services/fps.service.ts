type CallbackFunction = (time: number, frame: number) => void;

/**
 * Provides an API over `raf` (requestAnimationFrame)
 *
 * ## Example
 * ```typescript
 * import {FpsService} from '...'
 *
 * const fpsService = new FpsService(30, totalTime => {
 *     console.log('calling 30 times per second with totalTime: ', totalTime)
 * })
 * ```
 */
export class FpsService {
    /**
     * An integer value, describes with what frequency
     *  we should call `callback`
     * A fps must be between 1 - 60
     *  - 1 means we have to call `callback` once per second
     *  - 60 means we have to call `callback` 60 times per second
     *
     * @private
     */
    private fps: number;

    /**
     * A function value, describes what should to do
     *  when we need to re-render
     *
     * @private
     */
    private callback: CallbackFunction;
    private delay: number;
    private time: number | undefined;

    /**
     * An integer value, describes how many milliseconds
     *  passed from previous re-render call
     *
     * @private
     */
    private frame: number;

    /**
     * An integer value, the request id, that uniquely identifies
     *  the entry in the callback list. This is a non-zero value,
     *  but you may not make any other assumptions about its value.
     *
     * You can pass this value to `window.cancelAnimationFrame()` to cancel
     *  the refresh callback request.
     *
     * @private
     */
    private rafUID: number | undefined;
    private isRunning: boolean;

    constructor(fps: number, callback: CallbackFunction) {
        this.fps = fps;
        this.callback = callback;

        this.delay = 1000 / fps;
        this.time = undefined;
        this.frame = -1;
        this.rafUID = undefined;
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

        this.rafUID = requestAnimationFrame(this.loop);
    }

    public start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.rafUID = requestAnimationFrame(this.loop);
        }
    }
}
