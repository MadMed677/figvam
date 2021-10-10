import '@abraham/reflection';

import {Service, Inject} from 'typedi'
import {EntitySystem, Engine, Entity, Component, Family} from 'typed-ecstasy'

const engine = new Engine()

@Service()
class AssertService {
	public get(name: string): string {
		return name
	}
}

@Service()
class RenderSystem extends EntitySystem {
	@Inject()
	public readonly assertService!: AssertService

	protected override onEnable() {
		console.warn('[RenderSystem] onEnable')
		console.log(this.assertService.get('foo'))
	}

	public update(deltaTime: number): void {
	}
}

@Service()
class MovementSystem extends EntitySystem {
	private entities: Entity[] = []

	protected override onEnable() {
		this.entities = this.engine.entities.forFamily(Family.all(PositionComponent, VelocityComponent).get())

	}

	protected override onDisable() {
		this.entities = []
	}

	update(deltaTime: number): void {
		console.warn('[MovementSystem] update')
		for (const entity of this.entities) {
			const position = entity.require(PositionComponent)
			const velocity = entity.require(VelocityComponent)

			position.x += velocity.x * deltaTime
			position.y += velocity.y * deltaTime
		}
	}
}

class PositionComponent extends Component {
	x = 0;
	y = 0;
}

class VelocityComponent extends Component {
	x = 0;
	y = 0;
}

engine.systems.add(RenderSystem)
engine.systems.add(MovementSystem)

const ent1 = new Entity()

engine.entities.add(ent1)

ent1.add(new PositionComponent())
ent1.add(new VelocityComponent())

const render = () => {
	window.requestAnimationFrame((timestamp) => {
		console.log('raf', timestamp)
		engine.update(timestamp)

		render()
	})
}

// render()


