import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//import App from './App';
import App from './source_js_redux/licomponents/App';

import registerServiceWorker from './registerServiceWorker';

//import {Provider} from 'react-redux';
//import store from './source_js_redux/store';

ReactDOM.render(<App/>, document.getElementById('root'));

registerServiceWorker();
