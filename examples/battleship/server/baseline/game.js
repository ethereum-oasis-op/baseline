const { getIO, getSocket } = require('./utils/socket');
let games = new Map();

const userInGame = (id, game) => {
  return games.has(game) && games.get(game).players.map(player => player.id).includes(id);
}

const joinGame = (session, game) => {
  const socket = getSocket(session);

  socket.join(game);

  socket.on('game:move', (workgroup, message) => {
    console.log('Received:', workgroup, message);
  });
}

const startGame = (workgroup) => {
  let game = {
    id: workgroup.id,
    shieldContractAddress: workgroup.shieldContractAddress,
    players: workgroup.players.map(id => ({ id })),
    actions: []
  }

  console.log(`starting game with ID #${workgroup.id}`);
  updateGame(game);
}

const updateGame = (game) => {
  const gameExisted = games.has(game.id);

  games.set(game.id, game);

  getIO().to(game.id).emit(gameExisted ? 'game:update' : 'game:init', game);
}

const handleGameEvent = (type, event) => {
  if (!event.gameId) {
    console.error(`Game event ${event} does not specify a gameId.`);
  }

  getIO().to(event.gameId).emit('game:event', { type, data: event });
}

module.exports = {
  games,
  userInGame,
  startGame,
  joinGame,
  updateGame,
  handleGameEvent
}