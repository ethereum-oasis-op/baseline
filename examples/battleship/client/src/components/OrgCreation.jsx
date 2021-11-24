import React, { useState } from 'react';

import { Button, FormGroup, Input, FormFeedback, Label } from 'reactstrap'

export const OrgCreation = ({createOrg}) => {
  
  const [orgName, setOrgName] = useState('')

  return (
    <>
      <h2>Create your organization</h2>
      <p>
        In order to Baseline you need to create an organization first.
      </p>

      <FormGroup floating>
            <Input
                id='orgName'
                name='orgName'
                placeholder='Organization Name'
                type='text'
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                invalid={orgName === ''}
            />
            <FormFeedback>
                Organization name cannot be empty.
            </FormFeedback>
            <Label for='orgName'>
                Organization Name
            </Label>
        </FormGroup>

      <Button 
        onClick={  _ => createOrg(orgName) }
        disabled={orgName === ''}
      >
        Create
      </Button>
    </>
  );
};