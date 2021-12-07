import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik, FormikProvider} from 'formik';
import Button from '@material-ui/core/Button';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { ServerSettingsContext } from '../../contexts/server-settings-context';

const useStyles = makeStyles(() => ({
  root: {
    border: '1px soild red',
  },
  metamaskButton: {
    marginTop: '.8rem',
    marginBottom: '.8rem',
    border: '1px solid #CCCCCC',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFFFFF',
    paddingRight: '.8rem',
  },
  metamaskLogo: {
    width: '1.3rem',
    margin: '.5rem',
  },
  field: {
    margin: '1rem',
  },
}));

const WalletForm = () => {
  const classes = useStyles();
  const { state, setWalletFromMnemonic } = useContext(ServerSettingsContext);

  const formik = useFormik({
    initialValues: {
    },
    onSubmit: async values => {
      const { path } = values;
      let words = [];
      for(i=1; i <= 12 ; i++){
        words.push(values[`word-${i}`]);
      }
      const mnemonic = words.join(" ");
      await setWalletFromMnemonic({ variables: { mnemonic, path }});
    },
    validationSchema: Yup.object().shape({
    }),
  });


  const onPaste = event => {
    const pastedText = event.clipboardData.getData('Text');
    const words = pastedText.split(" ");
    event.preventDefault();
    for(i=0; i < words.length; i++){
      formik.setFieldValue(`word-${i+1}`, words[i]);
    }
  }

  const mnemonicFields = [];
  for( var i = 1; i <= 12; i++) {
    mnemonicFields.push(
      <TextField
        onChange={formik.handleChange}
        value={formik.values[`word-${i}`]}
        name={`word-${i}`}
        className={classes.field}
        onPaste={onPaste}
      />
    );
  }

  const mnemonicForm = () => (
    <Grid item xs={12}>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          {mnemonicFields}
          <TextField
            label="Path (optional)"
            onChange={formik.handleChange}
            value={formik.values.path}
            name="path"
            className={classes.field}
          />
          <Button type="submit">Ok</Button>
        </form>
      </FormikProvider>
    </Grid>
  );

  const balanceWarning = () => (
    <Grid item xs={12}>
      <h1>It appears like you don't have enough things</h1>
    </Grid>
  );

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div>You can either let the API generate it's own ethereum address or you can provide a mnemonic for an existing account.</div>
          <div>Please note, you will need at least 50 (?) ethereum in the account.</div>
        </Grid>
        { state === 'nowallet' ? mnemonicForm() : null }
        { state === 'nobalance' ? balanceWarning() : null }
      </Grid>
    </div>
  );
};

export default WalletForm;
