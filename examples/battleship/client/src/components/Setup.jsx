import React from 'react';

import axios from 'axios'

import { Row, Col } from 'reactstrap'
import { OrgCreation } from './OrgCreation';
import { GameSetup } from './GameSetup';

const SETUP_ORG_STATE = 'setupOrg'
const SETUP_WORKGROUP_STATE = 'setupWorkgroup'

export class Setup extends React.Component {
  constructor(props) {
    super(props)
    this.state = { setupState: SETUP_ORG_STATE, orgName: '' }
    // this.state = { setupState: SETUP_WORKGROUP_STATE, orgName: 'test org' } --- skips to workgroup setup

    this.createOrg = this.createOrg.bind(this)
  }


  createOrg = (orgName) => {
    axios.post('/organization/register', {
      name: orgName
    })
    .then((res) => {
      this.setState({ setupState: SETUP_WORKGROUP_STATE, orgName: orgName})

      this.props.setSession(res.data.id)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  render() {
    return <main>
        <Row className="centerCard">
            <Col sm="12" md={{offset: 3, size: 6}}>
                { 
                  this.state.setupState === SETUP_ORG_STATE ? 
                    <OrgCreation createOrg={this.createOrg} /> 
                  : 
                    <GameSetup orgName={ this.state.orgName } /> 
                }
            </Col>
        </Row>
    </main>
  }
};