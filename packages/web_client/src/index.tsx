import '@abraham/reflection';
import './types/global.d';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {FigvamFactory} from '@figvam/whiteboard';

const figvamWhiteboard = new FigvamFactory().create();

window.engine = figvamWhiteboard.engine;

ReactDOM.render(
    <React.StrictMode>
        <App
            engine={figvamWhiteboard.engine}
            graphics={figvamWhiteboard.graphics}
        />
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
