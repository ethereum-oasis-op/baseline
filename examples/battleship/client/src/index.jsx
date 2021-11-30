import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Setup } from './components/Setup';
import { Game } from './components/Game';

import { socket } from './utils/socket'

import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.css';

const SETUP_STATE = 'setup'
const GAME_STATE = 'game'

export const App = () => {
  const [appState, setAppState] = useState(SETUP_STATE)
  // const [appState, setAppState] = useState('TEST') -- skips right to game
  // const [appState, setAppState] = useState('TEST')

  const [session, setSession] = useState()


  socket.once('game:init', (id) => {
    console.log(id)
    setAppState(GAME_STATE)
  })


  return (
    <React.Fragment>
      { appState === SETUP_STATE ? <Setup setSession={setSession} /> : <div><Game session={session} id={appState}/></div> }

    </React.Fragment>
  )
}


ReactDOM.render(<App />, document.getElementById('root'));
