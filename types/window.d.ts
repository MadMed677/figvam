import {Engine} from 'typed-ecstasy';

declare global {
    interface Window {
        engine: Engine;
        __PIXI_INSPECTOR_GLOBAL_HOOK__: {
            register: (data: {PIXI: unknown}) => void;
        };
    }
}
