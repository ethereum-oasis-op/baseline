import React, { useState } from 'react';

import { Button, FormGroup, Input, FormFeedback, Label } from 'reactstrap'

export const OrgCreation = ({createOrg}) => {
  
  const [orgName, setOrgName] = useState('')

  return (
    <>
      <h2>Create your organization</h2>
      <p>
        Organizations are used in this example as a collective identifier for a Baseline "Subject" and are implementation specific. In a Baseline Process Implementation (BPI), any identifier used relative to a `Subject` can vary depending on the implementers current environment. Examples include users, groups or businesses. 

        In Battleship:Baseline, your organization will be squaring off against another organization in a Baseline `Workgroup.`
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