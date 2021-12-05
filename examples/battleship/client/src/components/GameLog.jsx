import React from 'react'

import {Card, CardHeader, CardBody, ListGroup, ListGroupItem, List} from 'reactstrap'

import '../styles/log.css'

export const PLACE_EVENT = 'place'
export const TARGET_EVENT = 'target'
export const RESULT_EVENT = 'proof'

export const GameLog = ({names, events}) => {
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
                                return <ListGroupItem key={index}>{player ? '🔍' : '🔎'} {names[player]} targeted square {data}.</ListGroupItem>    
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