import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Setup } from './components/Setup';
import { Game } from './components/Game';

import { socket } from './utils/socket'

import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.css';

export const App = () => {
  // const [appState, setAppState] = useState('setup')
  // const [appState, setAppState] = useState('TEST') -- skips right to game
  const [appState, setAppState] = useState('TEST')


  socket.once('game:init', (id) => {
    setAppState(id)
  })


  return (
    <React.Fragment>
      { appState === 'setup' ? <Setup /> : <div><Game id={appState}/></div> }

    </React.Fragment>
  )
}


ReactDOM.render(<App />, document.getElementById('root'));
