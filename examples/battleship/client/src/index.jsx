import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Setup } from './components/Setup';
import { Game } from './components/Game';

import { socket } from './utils/socket'

import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.css';


export const App = () => {

  const [userID, setUserID] = useState()
  const [game, setGame] = useState()

  useEffect(() => {
    socket.on('game:init', gameInitHandler)
  
    socket.on('message', console.log)

    return () => {
      socket.off('game:init', gameInitHandler)
      socket.off('message', console.log)
    }
  }, []);

  const gameInitHandler = (game) => {
      console.log('starting game', game.id)
      setGame(game)
  }



  return (
    <React.Fragment>
      { game === undefined ? <Setup userID={userID} setUserID={setUserID} /> : <div><Game userID={userID} game={game}/></div> }

    </React.Fragment>
  )
}


ReactDOM.render(<App />, document.getElementById('root'));
