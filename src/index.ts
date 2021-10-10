import '@abraham/reflection';

import {engine} from './core/engine'

const render = () => {
	window.requestAnimationFrame((timestamp) => {
		console.log('raf', timestamp)
		engine.update(timestamp)

		render()
	})
}

// render()


