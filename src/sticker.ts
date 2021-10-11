import * as PIXI from 'pixi.js';
import {addLayer, mousePosition} from './app';

export const createSticker = (x: number, y: number): void => {
    const stickerWidth = 100;
    const stickerHeight = 100;

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xdfcf8b, 1);
    graphics.beginFill(0xf3f374);

    graphics.x = x;
    graphics.y = y;

    graphics.drawRect(0, 0, stickerWidth, stickerHeight);

    graphics.endFill();

    graphics.interactive = true;
    graphics.buttonMode = true;
    graphics.pivot.x = 50;
    graphics.pivot.y = 50;

    let dragging = false;

    const onDragStart = () => {
        dragging = true;
    };

    const onDragEnd = () => {
        dragging = false;
        graphics.lineStyle(2, 0xdfcf8b, 1);
    };

    const onDragMove = () => {
        if (dragging) {
            graphics.x = mousePosition.x;
            graphics.y = mousePosition.y;
        }
    };

    graphics
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    addLayer(graphics);
};
