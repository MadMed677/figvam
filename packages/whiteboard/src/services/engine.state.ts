import {Service} from 'typedi';
import {GraphicsConstructor, IGraphics} from '../graphics';

@Service()
export class EngineState {
    private graphics: Map<string, GraphicsConstructor<IGraphics<unknown>>> = new Map()

    public addGraphics(graphics: Map<string, GraphicsConstructor<IGraphics<unknown>>>): void {
        graphics.forEach((graphicsItem, graphicsName) => {
            this.graphics.set(graphicsName, graphicsItem)
        })
    }

    public getGraphicsByName(name: string): GraphicsConstructor<IGraphics<unknown>> | undefined {
        return this.graphics.get(name)
    }
}
