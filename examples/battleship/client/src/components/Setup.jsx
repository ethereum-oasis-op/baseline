import React from 'react';

import axios from 'axios'

import { Row, Col } from 'reactstrap'
import { OrgCreation } from './OrgCreation';
import { GameSetup } from './GameSetup';


export const Setup = ({userID, setUserID}) => {

  const createOrg = (orgName) => {
    axios.post(`/organization`, {
      name: orgName
    })
    .then((res) => {
      setUserID(res.data.id)
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
                    userID === undefined ? 
                      <OrgCreation createOrg={createOrg} /> 
                    : 
                      <GameSetup id={userID} /> 
                  }
              </Col>
          </Row>
      </main>
    )
}