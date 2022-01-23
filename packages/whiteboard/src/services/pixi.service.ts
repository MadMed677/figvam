import {Service} from 'typedi';
import * as PIXI from 'pixi.js';
import {Viewport} from 'pixi-viewport';
import {CanvasBackgroundGraphics} from '../graphics';
import {ThemeService} from './theme.service';

@Service()
export class PixiService {
    private readonly application = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 2174781,
    });

    private readonly themeService: ThemeService;

    private viewport!: Viewport;

    constructor(themeService: ThemeService) {
        this.themeService = themeService;

        window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
            window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({
                PIXI: PIXI,
            });

        let dragTarget: any = null;
        let dragTargetBegin: any = null;

        const background = this.createBackground();
        const viewport = this.createViewport();
        const foreground = this.createForeground();

        const interactionManager = this.application.renderer.plugins
            .interaction as PIXI.InteractionManager;

        interactionManager
            .on('mousemove', (e: PIXI.InteractionEvent) => {
                if (dragTarget && e.data.buttons & 1) {
                    /*
                    dragTarget.position.set(
                        e.data.global.x - dragTargetBegin.x,
                        e.data.global.y - dragTargetBegin.y,
                    );*/

                    viewport.toLocal(
                        e.data.global,
                        undefined,
                        dragTarget.position,
                    );
                    dragTarget.x -= dragTargetBegin.x;
                    dragTarget.y -= dragTargetBegin.y;
                }
            })
            .on('mouseup', () => {
                dragTarget = null;
                dragTargetBegin = null;
            });

        this.application.stage.addChild(background, viewport, foreground);
    }

    private createBackground(): PIXI.Container {
        const background = new PIXI.Container();

        const backgroundGraphics = new CanvasBackgroundGraphics(-1);
        backgroundGraphics.setProps({
            position: {
                x: 0,
                y: 0,
            },
            size: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            theme: this.themeService.getTheme(),
        });
        backgroundGraphics.render();

        background.addChild(backgroundGraphics.visual);

        return background;
    }

    private createViewport(): PIXI.Container {
        const viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            // screenWidth: this.application.stage.width,
            // screenHeight: this.application.stage.height,
            worldWidth: window.innerWidth,
            worldHeight: window.innerHeight,
            // worldWidth: 10_000,
            // worldHeight: 10_000,

            interaction: this.application.renderer.plugins.interaction,
        });

        viewport
            .drag()
            .pinch()
            .wheel()
            .decelerate()
            .clamp({
                left: false,
                right: false,
                top: false,
                bottom: false,
                direction: 'all',
                underflow: 'center',
            })
            .clampZoom({
                minWidth: 1_000,
                maxWidth: 10_000,
            });

        // viewport.moveCenter(5_000, 5_000);

        // const sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
        // sprite.tint = 0xff0000;
        // sprite.width = sprite.height = 100;
        // sprite.position.set(
        //     viewport.worldWidth / 2 - 50,
        //     viewport.worldHeight / 2 - 50,
        // );
        // sprite.zIndex = 9;

        this.viewport = viewport;

        return viewport;
    }

    private createForeground(): PIXI.Container {
        return new PIXI.Container();
    }

    public getApplication(): PIXI.Application {
        return this.application;
    }

    public getViewportContainer(): Viewport {
        return this.viewport;
    }
}
