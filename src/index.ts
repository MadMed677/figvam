import '@abraham/reflection';

import {engine} from './core/engine'

const render = () => {
	window.requestAnimationFrame((timestamp) => {
		engine.update(timestamp)

		render()
	})
}

// render()


