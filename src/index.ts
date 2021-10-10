import '@abraham/reflection';
import {init} from './init'

import {engine} from './core/engine'

const render = () => {
	window.requestAnimationFrame((timestamp) => {
		engine.update(timestamp)

		render()
	})
}

// render()




init();