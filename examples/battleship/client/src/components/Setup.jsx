import React from 'react';

import axios from 'axios'

import { socket } from '../utils/socket'

import { Row, Col } from 'reactstrap'
import { OrgCreation } from './OrgCreation';
import { GameSetup } from './GameSetup';

const SETUP_ORG_STATE = 'setupOrg'
const SETUP_WORKGROUP_STATE = 'setupWorkgroup'

export const Setup = ({session, setSession}) => {

  const createOrg = (orgName) => {
    axios.post(`/organization/register/${socket.id}`, {
      name: orgName
    })
    .then((res) => {
      setSession(res.data.id)
    })
    .catch((error) => {
      console.log(error)
    })
  }

    return (
      <main>
          <Row className="centerCard">
              <Col sm="12" md={{offset: 3, size: 6}}>
                  { 
                    session === undefined ? 
                      <OrgCreation createOrg={createOrg} /> 
                    : 
                      <GameSetup session={session} /> 
                  }
              </Col>
          </Row>
      </main>
    )
}