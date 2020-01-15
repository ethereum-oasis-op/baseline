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

/*
//  - "homestead"
//  - "rinkeby"
//  - "ropsten"
//  - "kovan"
//  - "goerli"
*/

const options = [
  { label: 'Mainnet (Homestead)', value: 'homestead' },
  { label: 'Rinkeby', value: 'rinkeby' },
  { label: 'Ropsten', value: 'ropsten' },
  { label: 'Kovan', value: 'kovan' },
  { label: 'Goerli', value: 'goerli' },
  { label: 'Other', value: 'other' },
];

const ChooseNetworkForm = () => {
  const classes = useStyles();
  const { setRPCProvider, settings } = useContext(ServerSettingsContext);
  if (!settings) { return <div>No settings</div>}
  
  const { rpcProvider } = settings;

  const onSubmit = async ({ networkId, customRPCURL }) => {
    const id = networkId === 'other' ? customRPCURL : networkId;
    await setRPCProvider({
      variables: {
        uri: id,
      },
      fetchPolicy: 'no-cache',
    });
  };

  console.log('NETWORK FORM', { settings })
  console.log({ rpcProvider });

  return (
    <FormWrapper>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          networkId: 3,
        }}
        render={({ handleChange, values }) => {
          return (
            <Form className={classes.form}>
              <Field
                required
                name="networkId"
                id="networkId"
                onChange={handleChange}
                label="Ethereum Network"
                component={Select}
                placeholder="Mainnet"
                defaultValue="kovan"
                margin="normal"
                options={options}
              />

              {values.networkId === 'other' ? (
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Field
                      required
                      name="customRPCURL"
                      id="customRPCURL"
                      onChange={handleChange}
                      label="Custom RPC URL"
                      component={TextField}
                      fullWidth
                      placeholder="Ex: http://ganache:8545"
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              ) : null}

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

export default ChooseNetworkForm;
