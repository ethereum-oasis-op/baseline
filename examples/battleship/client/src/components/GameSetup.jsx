import { useState } from 'react';

import axios from 'axios'

import { Button, FormGroup, FormFeedback, Input, InputGroup, InputGroupText, Container, Row, Col } from 'reactstrap';

import {socket} from '../utils/socket'

import '../styles/gameSetup.css'

export const GameSetup = ({id}) => {
  
    const [gameCode, setGameCode] = useState('')
    const [workgroupId, setWorkgroupId] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

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
        axios.post('/api/workgroup', {
            id: id,
            session: socket.id
        })
        .then((res) => {
            setWorkgroupId(res.data.id)
        })
    }

    const joinWorkgroup = () => {
        axios.post(`/api/workgroup/join/${gameCode}`, {
            id: id,
            session: socket.id
        })
        .catch((error) => {
            switch(error.response.status) {
                case 403:
                    setErrorMessage('Invalid user authentication') 
                    break
                case 409:
                    if (error.response.data.error === 'User in workgroup')
                        setErrorMessage(`You are already in Workgroup ID #${gameCode}.`)
                    else if (error.response.data.error === 'Workgroup full')
                        setErrorMessage(`Workgroup ID #${gameCode} is full.`)
                    else setErrorMessage(`Something went wrong.`)
                    break
                case 404:
                    setErrorMessage(`Workgroup ID #${gameCode} does not exist.`)
                    break
                default:
                    setErrorMessage('Unexpected error from server')
            }
        })
    }

    return (
      <>
        <h2>Setup Workgroup</h2>
        <p>
        Once an organization has been established, the first step in baselining is setting up the collection of shared resources that will be involved in a specific Workflow or set of Workflows. This is called the Workgroup. In Battleship: Baseline, one initiating party will generate a new `Workgroup`` by creating a `Workgroup` name. Upon successful creation, a `Workgroup` reference ID will be generated and presented and will need to be delivered to the invitee out of band. In a BPI, for example, this can be accomplished by updating an OrgRegistry or interacting with a Decentralized Identifier directory/provider.
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
                <Col sm='8'>
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
                                invalid={errorMessage !== ''}
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
                                {errorMessage}
                            </FormFeedback>
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>

        </Container>
      </>
    );
};