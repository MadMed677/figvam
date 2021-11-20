# FigVam ![Travis (.org)](https://img.shields.io/travis/MadMed677/figvam) [![codecov](https://codecov.io/gh/MadMed677/figvam/branch/master/graph/badge.svg)](https://codecov.io/gh/MadMed677/figvam)

## Description

`FigVam` is a pet project building to figure out
how the products like `FigJam` / `Miro` works

## Development
- `npm install`
- `npx lerna bootstrap`

The app will live on `localhost:3000`

## Production
- `npm install`
- `npx lerna bootstrap`
- `cd packages/whiteboard_engine`
- `wasm-pack build`
- `cd ../../`
- `npm run build`

## Tech. stack
### Frontend
- PixiJS - Graphics
- Typed-Ecstasy - Entity Component System engine (ECS)
- Lerna - Monorepo
- ReactJS

### Engine
- Rust
- Web Assembly (Wasm)
