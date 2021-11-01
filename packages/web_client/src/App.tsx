import React from 'react';
import logo from './logo.svg';
import './App.css';

import '@figvam/whiteboard';

// const engine = FigvamEngine.getBuilder();
// const engine = FigvamEngine.getBuilder()
//     .withSystem(MouseSystem)
//     .withSystem(MovementSystem)
//     .withSystem(ObjectCreatorSystem)
//     .withSystem(ObjectSelectorSystem)
//     .withSystem(RenderSystem)
//     .withEntity(entity => {
//         entity.add(
//             new GraphicsComponent(new CanvasBackgroundGraphics(entity.getId())),
//         );
//         entity.add(new PositionComponent(0, 0));
//         entity.add(new SizeComponent(window.innerWidth, window.innerHeight));
//         entity.add(new SpawnableComponent());
//     })
//     .withEntity(entity => {
//         entity.add(new GraphicsComponent(new StickerGraphics(entity.getId())));
//         entity.add(new SelectableComponent());
//         entity.add(new PositionComponent(0, 0));
//         entity.add(new SizeComponent(100, 100));
//     })
//     .build();

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
