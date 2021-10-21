import {FpsService} from './fps.service';

/**
 * Delayed function stack execution
 * @param timeInMs Time in milliseconds
 *
 * @returns Promise The promise which should be resolved in `timeInMs` milliseconds
 */
const delay = (timeInMs: number): Promise<void> =>
    new Promise(resolve => {
        setTimeout(resolve, timeInMs);
    });

describe('FpsService', () => {
    test('requestAnimationFrame should be called 12 times per second', async () => {
        const mockRender = jest.fn();
        const fpsService = new FpsService(10, mockRender);

        fpsService.start();

        await delay(1200);

        fpsService.stop();
        expect(mockRender).toBeCalledTimes(12);
    });

    test('should throw an error when calling "start" method twice', () => {
        const mockRender = jest.fn();
        const fpsService = new FpsService(10, mockRender);

        fpsService.start();

        expect(() => fpsService.start()).toThrowError(
            'FpsService already started. Please call "stop" method before calling "start"',
        );
    });

    test('should throw an error when calling "stop" before calling "start"', () => {
        const mockRender = jest.fn();
        const fpsService = new FpsService(10, mockRender);

        expect(() => fpsService.stop()).toThrowError(
            'FpsService has not started. Please call "start" method before calling "stop"',
        );
    });
});
