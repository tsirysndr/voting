import React from 'react'
import ReactDOM from 'react-dom'
import './assets/fonts/google-sans/style.css'
import App from './App'
import Voting from './Voting'
import * as serviceWorker from './serviceWorker'
import './react-md.pink-indigo.min.css'
import './index.css'

import { DrizzleProvider } from '@drizzle/react-plugin'
import store from './middleware'
import drizzleOptions from './drizzleOptions'
import {
  HashRouter,
  Route,
} from 'react-router-dom'

ReactDOM.render(
  <DrizzleProvider store={store} options={drizzleOptions}>
    <HashRouter>
      <Route path='/' exact component={App} />
      <Route path='/voting/:address' component={Voting} />
    </HashRouter> 
  </DrizzleProvider>
  , document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
