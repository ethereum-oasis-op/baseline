import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Formik, Form, Field } from 'formik';
import { useMetaMask } from '../../contexts/metamask-context';
import { UserContext } from '../../contexts/user-context';
import TextField from '../TextField';
import Select from '../Select';

const useStyles = makeStyles(() => ({
  form: {
    width: '50%',
  },
}));

const NotRegistered = () => {
  const classes = useStyles();
  const { accounts } = useMetaMask();
  const { register } = useContext(UserContext);
  const currentAddress = accounts[0];

  const onSubmit = async formValues => {
    await register({ variables: { input: formValues }});
  }

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{ name: '', role: 'buyer', address: currentAddress }}
      render={({ handleChange }) => {
        return (
          <Form className={classes.form}>
            <h1>Register Your Organization</h1>

            <Field
              required
              name="name"
              id="orgName"
              onChange={handleChange}
              label={'Organization Name'}
              component={TextField}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <Field
              required
              name="role"
              id="orgRole"
              onChange={handleChange}
              label={'Organization Role'}
              component={Select}
              options={[
                { label: 'Buyer', value: 'buyer' },
                { label: 'Supplier', value: 'supplier' },
                { label: 'Carrier', value: 'carrier' },
              ]}
            />

            <Button
              variant="outlined"
              type="submit"
              color="primary"
              data-testid="register-button"
            >
              Register!
            </Button>
          </Form>
        );
      }}
    />
  );
};

export default NotRegistered;
