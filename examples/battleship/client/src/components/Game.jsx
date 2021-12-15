import React from 'react';

import axios from 'axios'

import { Container, Row, Col } from 'reactstrap';

import { PlayerBoard } from './PlayerBoard'
import { OpponentBoard } from './OpponentBoard';

import { GameInfo } from './GameInfo';
import { GameLog } from './GameLog';
import { ProofToast } from './ProofToast';

import { socket } from '../utils/socket'

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
            shipPosition: undefined,
            playerState: Array(25).fill(EMPTY),
            opponentState: Array(25).fill(EMPTY),
            game: this.props.game,
            playerNames: [],
            eventLog: [],
            toasts: []
        }

        this.playerNum.bind(this)
        this.shipPlaced.bind(this)
        this.opponentShipPlaced.bind(this)
        this.gameStarted.bind(this)
        this.placeShip.bind(this)
        this.targetSquare.bind(this)
        this.sendResult.bind(this)
        this.updateGame.bind(this)
        this.verify.bind(this)
        this.handleGameEvent.bind(this)
        this.removeToast.bind(this)
    }

    playerNum = (id) => {
        return + (this.state.game !== undefined &&
            this.state.game.players[0].id !== id)
    }

    shipPlaced = () => {
        if (this.state.game !== undefined) {
            let player = this.state.game.players
            .find(player => player.id === this.props.userID )

            return player.hash && player.hash.length > 0
        }

        return false
    }

    opponentShipPlaced = () => {
        if (this.state.game !== undefined) {
            let player = this.state.game.players
            .find(player => player.id !== this.props.userID )

            return player.hash && player.hash.length > 0
        }

        return false
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
            await axios.get(`/api/organization/${players[i].id}`)
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

            await axios.put(`/api/battleship/hash/${this.state.game.id}`, {
                id: this.props.userID,
                shipX: x,
                shipY: y,
                shipO: (+ orientation)
            })
            .catch(console.log)
            
            this.setState({shipPosition: {x, y, o: + orientation}, playerState: tempBoard })
        }
    }

    targetSquare = async (index) => {
        console.log('send move to opponent')
        
        let [x, y] = xyFromIndex(index)

        await axios.post('/api/battleship/target', {
            playerId: this.props.userID,
            gameId: this.state.game.id,
            x,
            y
        })
        .catch(console.log)
        
    }

    sendResult = async (coord, result, eventIndex) => {
        let playerNum = this.playerNum(this.props.userID)
        let {x, y, o} = this.state.shipPosition

        let [targetX, targetY] = xyFromCoord(coord)

        let hit = + (result === SHIP)

        await axios.post('/api/battleship/proof', {
            playerId: this.props.userID,
            gameId: this.state.game.id,
            shipX: x,
            shipY: y,
            shipO: o,
            shipHash: this.state.game.players[playerNum].hash,
            targetX,
            targetY,
            result:  hit
        })
        .then(() => {
            let events = this.state.eventLog
            events[eventIndex].data.responded = true
            this.setState({events})
        })
        .catch(_ => {
            let toasts = this.state.toasts
            toasts.push({coord: coord, attempt: hit})
            this.setState({toasts})
        })
    }

    updateGame = (game) => {
        const eventLog = this.state.eventLog
        
        console.log(game)

        for (let i = 0; i < 2; i++) {
            if (!this.state.game.players[i].hash || this.state.game.players[i].hash.length === 0) {
                if (game.players[i].hash && game.players[i].hash.length > 0) {
                    eventLog.push({
                        player: i,
                        type: 'place'
                    })
                }
            }
        }


        this.setState({eventLog, game})
    }

    verify = async (index, proof, publicSignals) => {
        let eventLog = this.state.eventLog
        eventLog[index].data.verification = 'verifying'

        this.setState({eventLog})

        await axios.post('/api/battleship/verify', {
            playerId: this.props.userID,
            gameId: this.state.game.id,
            proof,
            publicSignals
        })
        .then(() => {
            eventLog[index].data.verification = 'valid'
        })
        .catch(console.log)

        this.setState({eventLog})
    }

    handleGameEvent = (event) => {
        console.log(event)

        let playerNum = this.playerNum(event.data.playerId)

        let logItem = {player: playerNum, type: event.type, data: undefined}
        let opponentState = this.state.opponentState
        
        switch(event.type) {
            case 'target':
                logItem.data = {
                    coord: coordFromXY(event.data.x, event.data.y),
                    responded: false
                }
                break
            case 'proof':
                let result = parseInt(event.data.publicSignals[0])
                let x = parseInt(event.data.publicSignals[3])
                let y = parseInt(event.data.publicSignals[4])
                logItem.data = {
                    coord: coordFromXY(x, y),
                    result: result,
                    proof: event.data.proof,
                    publicSignals: event.data.publicSignals,
                    verification: undefined
                }

                if (event.data.playerId !== this.props.userID)
                    opponentState[x + y * BOARD_WIDTH] = result ? HIT : MISS
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
                        <GameLog  playerNum={this.playerNum(this.props.userID)} names={this.state.playerNames} events={this.state.eventLog} sendResult={this.sendResult} verify={this.verify}/>
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