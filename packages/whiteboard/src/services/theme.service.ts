import {Service} from 'typedi';
import * as PIXI from 'pixi.js';

interface IMediaQueryEvent {
    matches: boolean;
}

export interface IFigvamTheme {
    bgColor: {
        default: number;
        primary: number;
        accent: number;
    };
    border: {
        default: number;
        primary: number;
        accent: number;
    };
}

@Service()
export class ThemeService {
    private theme!: IFigvamTheme;

    constructor() {
        this.recognizeTheme = this.recognizeTheme.bind(this);

        const colorSchemeQueryList = window.matchMedia(
            '(prefers-color-scheme: dark)',
        );
        colorSchemeQueryList.addEventListener('change', this.recognizeTheme);

        this.recognizeTheme(colorSchemeQueryList);
    }

    private recognizeTheme(event: IMediaQueryEvent) {
        const theme: IFigvamTheme = (() => {
            if (event.matches) {
                return this.getDarkTheme();
            } else {
                return this.getLightTheme();
            }
        })();

        this.theme = theme;
    }

    public getTheme(): IFigvamTheme {
        return this.theme;
    }

    public getLightTheme(): IFigvamTheme {
        return {
            bgColor: {
                default: PIXI.utils.string2hex('#FFFFFF'),
                primary: PIXI.utils.string2hex('#FCF3CF'),
                accent: PIXI.utils.string2hex('#D5F5E3'),
            },
            border: {
                default: PIXI.utils.string2hex('#2E4053'),
                primary: PIXI.utils.string2hex('#F9E79F'),
                accent: PIXI.utils.string2hex('#ABEBC6'),
            },
        };
    }

    public getDarkTheme(): IFigvamTheme {
        return {
            bgColor: {
                default: PIXI.utils.string2hex('#212F3D'),
                primary: PIXI.utils.string2hex('#F1C40F'),
                accent: PIXI.utils.string2hex('#58D68D'),
            },
            border: {
                default: PIXI.utils.string2hex('#FFFFFF'),
                primary: PIXI.utils.string2hex('#D4AC0D'),
                accent: PIXI.utils.string2hex('#2ECC71'),
            },
        };
    }
}
