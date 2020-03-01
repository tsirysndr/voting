import React from 'react'
import ReactDOM from 'react-dom'
import './assets/fonts/google-sans/style.css'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { DrizzleProvider } from "@drizzle/react-plugin";
import store from './middleware'
import drizzleOptions from "./drizzleOptions"

ReactDOM.render(
  <DrizzleProvider store={store} options={drizzleOptions}>
    <App />
  </DrizzleProvider> 
, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
