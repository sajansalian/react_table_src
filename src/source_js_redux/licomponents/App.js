import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LiUserTable from '../licontainers/liUserTable'; 

import allReducers from '../lireducer/index';

//import store from './source_js_redux/store'
const store = createStore(allReducers);
//const storea = createStore(allReducers);


store.subscribe(() => {
	console.log("subscribe============", store.getState());
});


class App extends Component {
    render() {
        return (
            <div>
			    <Provider store={store}>
					<LiUserTable tableHeading="List of users" />                
                </Provider>
            </div>
        );
    }
}

export default App;
