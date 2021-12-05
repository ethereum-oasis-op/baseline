import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Setup } from './components/Setup';
import { Game } from './components/Game';

import { socket } from './utils/socket'

import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.css';

const SETUP_STATE = 'setup'

export const App = () => {
  const [appState, setAppState] = useState(SETUP_STATE)

  const [userID, setUserID] = useState()

  useEffect(() => {
    socket.on('game:init', gameInitHandler)
  
    socket.on('message', console.log)

    return () => {
      socket.off('game:init', gameInitHandler)
      socket.off('message', console.log)
    }
  }, []);

  const gameInitHandler = (gameID) => {
      console.log(gameID)
      setAppState(gameID)
  }



  return (
    <React.Fragment>
      { appState === SETUP_STATE ? <Setup userID={userID} setUserID={setUserID} /> : <div><Game userID={userID} id={appState}/></div> }

    </React.Fragment>
  )
}


ReactDOM.render(<App />, document.getElementById('root'));
