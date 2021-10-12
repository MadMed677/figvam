import * as PIXI from 'pixi.js';

export const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
});

export const addLayer = (graphics: PIXI.Graphics): void => {
    app.stage.addChild(graphics);
};

export const mousePosition = app.renderer.plugins.interaction.mouse.global;
