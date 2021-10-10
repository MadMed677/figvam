import {addLayer, app, mousePosition} from './app'
import {createSticker} from './sticker'
import {createBackground} from './canvasBackground'

export const init = (): void => {
	const background = createBackground()
	background.interactive = true

	background.on('click', () => {
		const {x, y} = mousePosition

		createSticker(x, y)
	})

	addLayer(background)

	document.body.appendChild(app.view);
}