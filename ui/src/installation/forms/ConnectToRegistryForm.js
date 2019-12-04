import React, { useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormWrapper from '../components/FormWrapper';
import FormButtonWrapper from '../components/FormButtonWrapper';
import TextField from '../../components/TextField';
import { ServerSettingsContext } from '../../contexts/server-settings-context';

const useStyles = makeStyles(() => ({
  button: {
    marginTop: '2rem',
    marginBottom: '2rem',
    border: '1px solid #CCCCCC',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFFFFF',
    paddingRight: '.8rem',
  },
}));

const ConnectToRegistryForm = () => {
  const classes = useStyles();
  const { setOrganizationRegistryAddress } = useContext(ServerSettingsContext);

  const onSubmit = async ({ organizationRegistryAddress }) => {
    await setOrganizationRegistryAddress({ variables: { organizationRegistryAddress } });
  };

  return (
    <FormWrapper>
      <Formik
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ handleChange }) => {
          return (
            <Form className={classes.form}>
              <Field
                required
                name="organizationRegistryAddress"
                id="organizationRegistryAddress"
                onChange={handleChange}
                label="Organization Registry Address"
                component={TextField}
                fullWidth
                placeholder="Mainnet"
                margin="normal"
                // InputLabelProps={{ shrink: true }}
              />

              <div>OR</div>

              <div>Deploy your own</div>
              <div>You do not have enough gas.</div>

              <FormButtonWrapper>
                <Button
                  variant="outlined"
                  type="submit"
                  color="primary"
                  data-testid="register-button"
                >
                  Continue
                </Button>
              </FormButtonWrapper>
            </Form>
          );
        }}
      />
    </FormWrapper>
  );
};

export default ConnectToRegistryForm;
