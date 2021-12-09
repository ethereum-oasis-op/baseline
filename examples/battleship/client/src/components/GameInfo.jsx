import {Card, CardHeader, CardBody} from 'reactstrap'

export const GameInfo = ({names}) => {
    return (
        <Card>
            <CardHeader>Game Info</CardHeader>

            <CardBody>
                The bottom board displayed here is your system of record. It holds the position of your ship.

                Place your ship by moving the highlighted squares to the desired position. 

                The position of your ship in relation to the coordinate grid will be used to generate the current state of your system of record. 

                Once both players have placed their ships, the game will begin.
                <h4>Player 1: {names[0]}</h4>
                <h4>Player 2: {names[1]}</h4>
                {/* <h4>Your Turn</h4> */}
            </CardBody>
        </Card>
    )
}