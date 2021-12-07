import React from 'react'

import {Button, Card, CardHeader, CardBody, Row, Col, ListGroup, ListGroupItem, Spinner} from 'reactstrap'

import { EMPTY, SHIP } from './Game'

import '../styles/log.css'

const PLACE_EVENT = 'place'
const TARGET_EVENT = 'target'
const RESULT_EVENT = 'proof'

export const GameLog = ({playerNum, names, events, sendResult, verify}) => {

    return (
        <Card className='mt-5'>
            <CardHeader>
                Game Log
            </CardHeader>
            <CardBody>
            <div className="list-group-container">
                <ListGroup flush>
                    {events.map((event, index) => {
                        let {player, type, data} = event
                        switch(type) {
                            case PLACE_EVENT:
                                return <ListGroupItem key={index}>{player ? '🚢' : '🛳️'} {names[player]} placed their ship.</ListGroupItem>
                            case TARGET_EVENT:
                                return <ListGroupItem key={index}>
                                    <Row>
                                    <Col md={8}>{player ? '🔍' : '🔎'} {names[player]} targeted square {data.coord}.</Col>
                                    {playerNum !== player && !data.responded ? 
                                    <>
                                    <Col md={2}><Button color='success' outline onClick={() => sendResult(data.coord, SHIP, index)}>Hit</Button></Col>
                                    <Col md={2}><Button color='danger' outline onClick={() => sendResult(data.coord, EMPTY, index)}>Miss</Button></Col>
                                    </> : <></>}
                                    </Row>
                                    </ListGroupItem>    
                            case RESULT_EVENT:
                                let status
                                switch(data.verification) {
                                    case 'verifying':
                                        status = <Spinner color="primary" size="sm">Loading...</Spinner>
                                        break
                                    case 'valid':
                                        status = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                            <path fill="#5cb85c" d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        break
                                    case 'invalid':
                                        status = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                            <path fill="#d9534f" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                        break
                                    default:
                                        status = <Button color='link' onClick={() => verify(index, data.proof, data.publicSignals)}>Verify</Button>
                                }

                                return <ListGroupItem key={index}>
                                    <Row>
                                    <Col md={8}>{data.result ? '💥' : '💧'} {names[player]} says {data.coord} is a {data.result ? 'hit' : 'miss'}.</Col>
                                    <Col md={2}>{playerNum !== player ? status : <></>}</Col>
                                    </Row>
                                    
                                    </ListGroupItem>    
                            default:
                                return <ListGroupItem key={index}>{player} attempted an invalid event of type {type} </ListGroupItem>
                        }
                    })}
                </ListGroup>
            </div>
            </CardBody>
        </Card>
    )
}