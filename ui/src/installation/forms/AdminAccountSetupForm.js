import React from 'react';
import { Formik, Form, Field } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormWrapper from '../components/FormWrapper';
import FormButtonWrapper from '../components/FormButtonWrapper';
import TextField from '../../components/TextField';

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

const AdminAccountSetupForm = () => {
  const classes = useStyles();

  const onSubmit = async () => {};

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
                name="name"
                id="orgName"
                onChange={handleChange}
                label="Network Id"
                component={TextField}
                fullWidth
                placeholder="Mainnet"
                margin="normal"
                // InputLabelProps={{ shrink: true }}
              />

              <Field
                required
                name="name"
                id="orgName"
                onChange={handleChange}
                label="Organization Registry Address"
                component={TextField}
                fullWidth
                placeholder="Ex: 0x1234567890"
                margin="normal"
                // InputLabelProps={{ shrink: true }}
              />
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

export default AdminAccountSetupForm;
