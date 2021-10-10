import * as PIXI from 'pixi.js'

export const createBackground = (): PIXI.Graphics => {
	const graphics = new PIXI.Graphics()
	graphics.hitArea = new PIXI.Rectangle(0, 0, 10000, 10000)
	graphics.clear()
	graphics.beginFill(0x7d99e3, 1)
	graphics.drawRect(0, 0, window.innerWidth, window.innerHeight)
	graphics.endFill()
	return graphics
}
