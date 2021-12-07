import {Card, CardHeader, CardBody} from 'reactstrap'

export const GameInfo = ({names}) => {
    return (
        <Card>
            <CardHeader>Game Info</CardHeader>

            <CardBody>
                <h4>Player 1: {names[0]}</h4>
                <h4>Player 2: {names[1]}</h4>
                {/* <h4>Your Turn</h4> */}
            </CardBody>
        </Card>
    )
}