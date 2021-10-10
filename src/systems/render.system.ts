import {Service} from 'typedi'
import {EntitySystem} from 'typed-ecstasy'

@Service()
export class RenderSystem extends EntitySystem {
	protected override onEnable() {
		console.warn('[RenderSystem] onEnable')
	}

	public update(deltaTime: number): void {
		console.log('[RenderSystem] update', deltaTime)
	}
}

