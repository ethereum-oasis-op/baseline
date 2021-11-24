import { useState } from 'react';

import { Button, FormGroup, FormFeedback, Input, InputGroup, InputGroupText, Container, Row, Col } from 'reactstrap';

import { socket } from '../utils/socket'

import '../styles/gameSetup.css'

export const GameSetup = ({orgName}) => {
  
    const [gameCode, setGameCode] = useState('')
    const [workgroupId, setWorkgroupId] = useState('')
    const [invalidId, setInvalidId] = useState('')

    const updateCodeValue = (value) => {
        let upper = value.toUpperCase()

        if (upper.length > gameCode.length) {

            let matches = upper.match(/([A-Z0-9])+/)

            if (matches?.length === 2 && matches[0].length <= 4) {
                setGameCode(matches[0])
            }
        }
        else {
            setGameCode(upper)
        }
    }

    const createWorkgroup = () => {
        socket.emit('workgroup:create')
    }

    const joinWorkgroup = () => {
        socket.emit('workgroup:join', gameCode)
    }

    socket.on('workgroup:id', setWorkgroupId)

    socket.on('workgroup:invalid_id', setInvalidId)

    return (
      <>
        <h2>Setup Workgroup</h2>
        <p>
            Hello {orgName}. Now that you've registered an organization it's time to create or join a workgroup. (EXPAND EXPLANATION) 
        </p>

        <Container>
            <Row className='button-row'>
                <Col>
                { workgroupId === '' ? 
                    <Button 
                        color='primary'
                        onClick={  createWorkgroup }
                        size='lg'
                    >
                        Create Workgroup
                    </Button>
                :  
                    <>
                    Share your Workgroup ID with another player:
                    <h1 className='workgroup-id'>#{workgroupId}</h1>
                    </>
                }
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3 className='or'>OR</h3>
                </Col>
            </Row>
            <Row>
                <Col sm='7'>
                    <FormGroup floating>
                        <InputGroup size='lg'>
                            <InputGroupText>#</InputGroupText>
                            <Input
                                id='gameCode'
                                name='gameCode'
                                placeholder='0000'
                                type='text'
                                value={gameCode}
                                onChange={e => updateCodeValue(e.target.value)}
                                invalid={invalidId !== ''}
                            />
                            <Button 
                                color='primary'
                                outline
                                onClick={  joinWorkgroup } 
                                disabled={gameCode.length !== 4}
                            >
                                Join Workgroup
                            </Button>
                            <FormFeedback>
                                Workgroup ID #{invalidId} is not valid.
                            </FormFeedback>
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>

        </Container>
      </>
    );
};