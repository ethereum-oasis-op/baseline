import React from 'react';

import axios from 'axios'

import { Container, Row, Col } from 'reactstrap';

import { PlayerBoard } from './PlayerBoard'
import { OpponentBoard } from './OpponentBoard';

import { GameInfo } from './GameInfo';
import { GameLog } from './GameLog';
import { ProofToast } from './ProofToast';

import { socket } from '../utils/socket'

import '../styles/game.css'

export const BOARD_WIDTH = 5;
export const SHIP_LENGTH = 3;
export const COORDS = ['A', 'B', 'C', 'D', 'E']

export const EMPTY = 'empty'
export const SHIP = 'ship'
export const HIT = 'hit'
export const MISS = 'miss'

export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // gameState: SETUP_STATE,
            playerState: Array(25).fill(EMPTY),
            opponentState: Array(25).fill(EMPTY),
            game: this.props.game,
            playerNames: [],
            eventLog: [],
            toasts: ['A3', 'B2']
        }

        this.playerNum.bind(this)
        this.shipPlaced.bind(this)
        this.opponentShipPlaced.bind(this)
        this.gameStarted.bind(this)
        this.placeShip.bind(this)
        this.targetSquare.bind(this)
        this.sendResult.bind(this)
        this.updateGame.bind(this)
        this.handleGameEvent.bind(this)
        this.removeToast.bind(this)
    }

    playerNum = (id) => {
        return + (this.state.game !== undefined &&
            this.state.game.players[0].id !== id)
    }

    shipPlaced = () => {
        return this.state.game !== undefined && 
            this.state.game.players
            .find(player => player.id === this.props.userID )
            .hash
    }

    opponentShipPlaced = () => {
        return this.state.game !== undefined && 
            this.state.game.players
            .find(player => player.id !== this.props.userID )
            .hash
    }

    gameStarted = () => {
        return this.state.game.players
            .filter(player => player.hash !== undefined)
            .length === 2
    }

    async componentDidMount () {
        let players = this.state.game.players
        let playerNames = []

        for (let i = 0; i < 2; i++) {
            await axios.get(`/organization/${players[i].id}`)
            .then((res) => {
                playerNames.push(res.data.name)
            })
            .catch(console.log)
        }

        this.setState({playerNames})

        socket.on('game:update', this.updateGame)
        socket.on('game:event', this.handleGameEvent)
    }

    componentWillUnmount() {
        socket.off('game:update', this.updateGame)
    }

    placeShip = async (index, orientation) => {
        if (!this.shipPlaced()) {
            let tempBoard = this.state.playerState

            tempBoard[index] = SHIP
            tempBoard[index + (orientation ? BOARD_WIDTH : 1)] = SHIP
            tempBoard[index + (orientation ? 2 * BOARD_WIDTH : 2)] = SHIP

            let [x, y] = xyFromIndex(index)

            await axios.put(`/battleship/hash/${this.state.game.id}`, {
                id: this.props.userID,
                shipX: x,
                shipY: y,
                shipO: orientation
            })
            .catch(console.log)
            
            this.setState({ playerState: tempBoard })
        }
    }

    targetSquare = async (index) => {
        console.log('send move to opponent')
        
        let [x, y] = xyFromIndex(index)

        await axios.post('/battleship/target', {
            playerId: this.props.userID,
            gameId: this.state.game.id,
            x,
            y
        })
        .catch(console.log)
        
    }

    sendResult = async (coord, result) => {
        console.log('send result')

        const [x, y] = xyFromCoord(coord)

        const index = y * BOARD_WIDTH + x

        const accurate = result === this.state.playerState[index]

        if (accurate) {
            let event = {type: 'proof', data: {
                playerId: this.props.userID,
                gameId: this.state.game.id,
                x,
                y,
                result: result
            }}

            return this.handleGameEvent(event)
        }
        
        let toasts = this.state.toasts
        toasts.push(coord)
        this.setState({coord})
    }

    updateGame = (game) => {
        const eventLog = this.state.eventLog
        
        for (let i = 0; i < 2; i++) {
            if (!this.state.game.players[i].hash && game.players[i].hash) {
                eventLog.push({
                    player: i,
                    type: 'place'
                })
            }
        }


        console.log(game)
        this.setState({eventLog, game})
    }

    handleGameEvent = (event) => {
        console.log(event)

        let playerNum = this.playerNum(event.data.playerId)

        let logItem = {player: playerNum, type: event.type, data: undefined}
        
        switch(event.type) {
            case 'target':
                logItem.data = coordFromXY(event.data.x, event.data.y)
                break
            case 'proof':
                logItem.data = {
                    coord: coordFromXY(event.data.x, event.data.y),
                    result: event.data.result
                }
                break
            default:
                console.error('Unsupported event of type', event.type, event)
                break;
        }

        const eventLog = this.state.eventLog
        eventLog.push(logItem)
        this.setState({eventLog})
    }

    removeToast = (index) => {
        let toasts = this.state.toasts
        toasts.splice(index, 1)
        this.setState({toasts})
    }

    render() {
        return (
            <>
            <Container>
                <Row>
                    <h2>Start game with id {this.state.game.id}</h2>
                </Row>
                <Row>
                    <Col md={6}>
                        <Row>
                            <OpponentBoard squares={this.state.opponentState} targeting={this.gameStarted()} targetSquare={this.targetSquare} />
                        </Row>
                        <Row className='mt-3'>
                            <PlayerBoard squares={this.state.playerState} shipPlaced={this.shipPlaced()} placeShip={this.placeShip} />
                        </Row>
                    </Col>
                    <Col md={6}>
                        <GameInfo names={this.state.playerNames} />
                        <GameLog  playerNum={this.playerNum(this.props.userID)} names={this.state.playerNames} events={this.state.eventLog} sendResult={this.sendResult}/>
                    </Col>
                </Row>
            </Container>

            <div className="position-fixed bottom-0 end-0 p-3" style={{'zIndex': 11}}>
                {this.state.toasts.map((toast, index) =>
                    <ProofToast key={index} index={index} toast={toast} removeToast={this.removeToast} />)}
            </div>
            </>
        )
    }
}

export const coordFromIndex = (index) => {
    return `${COORDS[Math.floor(index % BOARD_WIDTH)]}${Math.floor(index / BOARD_WIDTH)}`
}

const coordFromXY = (x, y) => {
    return `${COORDS[x]}${y}`
}

const xyFromCoord = (coord) => {
    let x = COORDS.indexOf(coord[0])
    let y = parseInt(coord[1])
    return [x, y]
}

const xyFromIndex = (index) => {
    return [Math.floor(index % BOARD_WIDTH), Math.floor(index / BOARD_WIDTH)]
}