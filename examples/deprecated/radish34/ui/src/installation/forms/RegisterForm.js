import React, { useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormWrapper from '../components/FormWrapper';
import FormButtonWrapper from '../components/FormButtonWrapper';
import TextField from '../../components/TextField';
import Select from '../../components/Select';
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

const roles = [
  { label: 'Buyer', value: 1, disabled: false, },
  { label: 'Supplier', value: 2, disabled: false, },
  { label: 'Carrier', value: 3, disabled: true, },
];

const RegisterForm = () => {
  const classes = useStyles();
  const { registerOrganizationInfo } = useContext(ServerSettingsContext);

  const onSubmit = async ({ organizationName, role }) => {
    await registerOrganizationInfo({
      variables: {
        input: {
          name: organizationName,
          role: role,
        },
      },
    });
  };

  return (
    <FormWrapper>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          role: 1,
        }}
        render={({ handleChange }) => {
          return (
            <Form className={classes.form}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Field
                    required
                    name="organizationName"
                    id="organizationName"
                    onChange={handleChange}
                    label="Organization Name"
                    component={TextField}
                    fullWidth
                    placeholder="Ex: Radish Man Co."
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    required
                    name="role"
                    id="role"
                    onChange={handleChange}
                    label="Role"
                    component={Select}
                    placeholder={1}
                    defaultValue={1}
                    margin="normal"
                    options={roles}
                  />
                </Grid>
              </Grid>

              <FormButtonWrapper>
                <Button
                  variant="outlined"
                  type="submit"
                  color="primary"
                  data-testid="register-button"
                >
                  Next
                </Button>
              </FormButtonWrapper>
            </Form>
          );
        }}
      />
    </FormWrapper>
  );
};

export default RegisterForm;
