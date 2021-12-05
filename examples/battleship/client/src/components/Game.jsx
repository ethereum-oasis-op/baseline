import React from 'react';

import axios from 'axios'

import { Container, Row, Col } from 'reactstrap';

import { PlayerBoard } from './PlayerBoard'
import { OpponentBoard } from './OpponentBoard';

import { GameInfo } from './GameInfo';
import { GameLog, LogEntry, PLACE_EVENT, RESULT_EVENT, TARGET_EVENT } from './GameLog';

import '../styles/game.css'

export const BOARD_WIDTH = 5;
export const SHIP_LENGTH = 3;
export const COORDS = ['A', 'B', 'C', 'D', 'E']

export const EMPTY = 'empty'
export const SHIP = 'ship'
export const HIT = 'hit'
export const MISS = 'miss'

const SETUP_STATE = 'setup'
const ACTIVE_STATE = 'you'
const PASSIVE_STATE = 'opponent'
const GAMEOVER_STATE = 'game over'

export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameState: SETUP_STATE,
            playerState: Array(25).fill(EMPTY),
            opponentState: Array(25).fill(EMPTY),
            game: undefined
        }

        this.shipPlaced.bind(this)
        this.opponentShipPlaced.bind(this)
        this.placeShip.bind(this)
        this.targetSquare.bind(this)
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

    async componentDidMount () {
        await axios.get(`/battleship/${this.props.id}`)
        .then((res) => {
        console.log('game', res)
        })
        .catch((error) => {
        console.log(error)
        })
    }

    placeShip = async (index, orientation) => {
        if (!this.shipPlaced()) {
            let tempBoard = this.state.playerState

            tempBoard[index] = SHIP
            tempBoard[index + (orientation ? BOARD_WIDTH : 1)] = SHIP
            tempBoard[index + (orientation ? 2 * BOARD_WIDTH : 2)] = SHIP

            console.log('send event here')
            
            this.setState({ gameState: ACTIVE_STATE, playerState: tempBoard })
        }

        console.log(this.state.gameState)
    }

    targetSquare = (index) => {
        console.log('send move to opponent')
        let hit = Math.floor(Math.random() * 2)   // temporary hit chance

        let tempBoard = this.state.opponentState

        tempBoard[index] = hit === 1 ? HIT : MISS

        let newEventLog = this.state.events
        newEventLog.push(LogEntry({player: 0, type: TARGET_EVENT, data: coordFromIndex(index)}))
        newEventLog.push(LogEntry({player: 0, type: RESULT_EVENT, data: {coord: coordFromIndex(index), result: hit}}))

        this.setState({gameState: ACTIVE_STATE, opponentState: tempBoard, events: newEventLog})
    }

    recordEvent = (event) => {
        
    }

    render() {
        return (
            <Container>
                <Row>
                    <h2>Start game with id {this.props.id}</h2>
                </Row>
                <Row>
                    <Col md={6}>
                        <Row>
                            <OpponentBoard squares={this.state.opponentState} targeting={this.state.gameState === ACTIVE_STATE} targetSquare={this.targetSquare} />
                        </Row>
                        <Row className='mt-3'>
                            <PlayerBoard squares={this.state.playerState} shipPlaced={this.shipPlaced()} placeShip={this.placeShip} />
                        </Row>
                    </Col>
                    <Col md={6}>
                        <GameInfo />
                        <GameLog events={this.state.events} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export const coordFromIndex = (index) => {
    return `${COORDS[Math.floor(index % BOARD_WIDTH)]}${Math.floor(index / BOARD_WIDTH)}`
}