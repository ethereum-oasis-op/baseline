import {Card, CardHeader, CardTitle, CardBody} from 'reactstrap'

export const GameInfo = () => {
    return (
        <Card>
            <CardHeader>Game Info</CardHeader>

            <CardBody>
                <h4>Player 0</h4>
                <h4>Player 1</h4>
                <h4>Your Turn</h4>
            </CardBody>
        </Card>
    )
}