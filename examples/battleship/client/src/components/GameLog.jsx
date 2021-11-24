import React from 'react'

import {Card, CardHeader, CardBody, ListGroup, ListGroupItem} from 'reactstrap'

import '../styles/log.css'

export const PLACE_EVENT = 0
export const TARGET_EVENT = 1
export const RESULT_EVENT = 2

export const GameLog = ({events}) => {
    return (
        <Card className='mt-5'>
            <CardHeader>
                Game Log
            </CardHeader>
            <CardBody>
            <div className="list-group-container">
                <ListGroup flush>
                    {events}
                </ListGroup>
            </div>
            </CardBody>
        </Card>
    )
}

export const LogEntry = ({player, type, data=undefined}) => {
    switch(type) {
        case PLACE_EVENT:
            return <ListGroupItem>{player ? '🚢' : '🛳️'} {player} placed their ship.</ListGroupItem>
        case TARGET_EVENT:
            return <ListGroupItem>{player ? '🔍' : '🔎'} {player} targeted square {data}.</ListGroupItem>    
        case RESULT_EVENT:
            return <ListGroupItem>{data.result ? '💥' : '💧'} {data.coord} is a {data.result ? 'hit' : 'miss'}.</ListGroupItem>    
        default:
            return <ListGroupItem>{player} attempted an invalid event of type {type} </ListGroupItem>
    }
}