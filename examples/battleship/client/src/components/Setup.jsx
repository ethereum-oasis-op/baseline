import React from 'react';

import { Row, Col } from 'reactstrap'
import { OrgCreation } from './OrgCreation';
import { GameSetup } from './GameSetup';

export class Setup extends React.Component {
  constructor(props) {
    super(props)
    this.state = { setupState: 'orgCreation', orgName: '' }
    // this.state = { setupState: 'workgroupSetup', orgName: 'test org' } --- skips to workgroup setup

    this.createOrg = this.createOrg.bind(this)
  }


  createOrg = (orgName) => {
    console.log('Register organization: ', orgName)

    this.setState({ setupState: 'workgroupSetup', orgName: orgName})
  }

  render() {
    return <main>
        <Row className="centerCard">
            <Col sm="12" md={{offset: 3, size: 6}}>
                { 
                  this.state.setupState === 'orgCreation' ? 
                    <OrgCreation createOrg={this.createOrg} /> 
                  : 
                    <GameSetup orgName={ this.state.orgName } /> 
                }
            </Col>
        </Row>
    </main>
  }
};