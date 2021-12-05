import React from 'react'

import {Button, Card, CardHeader, CardBody, Row, Col, ListGroup, ListGroupItem} from 'reactstrap'

import { EMPTY, SHIP } from './Game'

import '../styles/log.css'

const PLACE_EVENT = 'place'
const TARGET_EVENT = 'target'
const RESULT_EVENT = 'proof'

export const GameLog = ({playerNum, names, events, sendResult}) => {
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
                                    <Col md={8}>{player ? '🔍' : '🔎'} {names[player]} targeted square {data}.</Col>
                                    {playerNum !== player ? 
                                    <>
                                    <Col md={2}><Button color='success' outline onClick={() => sendResult(data, SHIP)}>Hit</Button></Col>
                                    <Col md={2}><Button color='danger' outline onClick={() => sendResult(data, EMPTY)}>Miss</Button></Col>
                                    </> : <></>}
                                    </Row>
                                    </ListGroupItem>    
                            case RESULT_EVENT:
                                return <ListGroupItem key={index}>{data.result ? '💥' : '💧'} {data.coord} is a {data.result ? 'hit' : 'miss'}.</ListGroupItem>    
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