import * as PIXI from 'pixi.js';
import addons from '@storybook/addons';
import {
    CanvasBackgroundGraphics,
    ICanvasBackgroundGraphicsProps,
    IGraphics,
} from '../graphics';
import {ThemeService} from '../services';

const channel = addons.getChannel();

interface IPixiContainerBuilder {
    withContainer(width: number, height: number): IPixiContainerBuilder;
    withElement(element: IGraphics<unknown>): IPixiContainerBuilder;
    withTheme(theme: ThemeService): IPixiContainerBuilder;
    update(props: any): void;
    build(): HTMLElement;
}

export class PixiContainer {
    public static getBuilder(): IPixiContainerBuilder {
        return new (this.builder())();
    }

    private static builder() {
        return class BuilderConstructor implements IPixiContainerBuilder {
            private pixiApplication: PIXI.Application | undefined;
            private container: HTMLElement | undefined;
            private themeService: ThemeService | undefined;
            private elements: Array<IGraphics<unknown>> = [];
            private background: IGraphics<ICanvasBackgroundGraphicsProps> =
                new CanvasBackgroundGraphics(0);

            constructor() {
                channel.on('DARK_MODE', (isDarkMode: boolean) => {
                    this.background.setProps({
                        theme: isDarkMode
                            ? this.themeService!.getDarkTheme()
                            : this.themeService!.getLightTheme(),
                        size: {
                            width: window.innerWidth,
                            height: window.innerHeight,
                        },
                        position: {
                            x: 0,
                            y: 0,
                        },
                    });
                    this.background.render();
                });
            }

            public withContainer(
                width: number,
                height: number,
            ): IPixiContainerBuilder {
                this.container = document.createElement('div');
                this.container.className = 'story-layer-container';
                this.container.setAttribute(
                    'style',
                    `height: ${height}px; width: ${width}px;background-color: #eee;`,
                );
                this.container.setAttribute('height', `${height}`);
                this.container.setAttribute('width', `${width}`);

                this.pixiApplication = new PIXI.Application({
                    width,
                    height,
                });

                this.pixiApplication.stage.addChild(this.background.visual);

                return this;
            }

            public withElement(
                element: IGraphics<unknown>,
            ): IPixiContainerBuilder {
                this.elements.push(element);
                this.pixiApplication!.stage.addChild(element.visual);

                return this;
            }

            public withTheme(
                themeService: ThemeService,
            ): IPixiContainerBuilder {
                this.themeService = themeService;

                return this;
            }

            public update(props: any): void {
                this.elements.forEach(element => {
                    element.setProps(props);
                    element.render();
                });
            }

            public build(): HTMLElement {
                if (!this.container || !this.pixiApplication) {
                    throw new Error(
                        'Should call "withContainer" method before "build"',
                    );
                }

                this.container.appendChild(this.pixiApplication.view);

                return this.container;
            }
        };
    }
}
