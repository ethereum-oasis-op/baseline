import React, { useContext } from 'react';
import { useFormik, Field, FormikProvider, ErrorMessage } from 'formik';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import DatePickerField from '../components/DatePickerField';
import AddSKUField from '../components/AddSKUField';
import AddSuppliersField from '../components/AddSuppliersField';
import { RFPContext } from '../contexts/rfp-context';
import { PartnerContext } from '../contexts/partner-context';
import MessageLayout from '../components/MessageLayout';

const useStyles = makeStyles(() => ({
  field: {
    width: '100%',
    marginBottom: '1rem',
  },
  errorMessage: {
    color: 'red',
  },
}));

const CreateRFP = () => {
  const classes = useStyles();
  const { postRFP } = useContext(RFPContext);
  const { data } = useContext(PartnerContext);
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      description: '',
      dateDeadline: moment(Date.now()),
      sku: '',
      skuDescription: '',
      suppliers: [],
    },
    onSubmit: async values => {
      await postRFP({ variables: { input: values } });
      history.push('/messages/outbox');
    },
    validationSchema: Yup.object().shape({
      description: Yup.string().required('RFP Description required'),
      sku: Yup.string().required('Input SKU number'),
      suppliers: Yup.array()
        .of(
          Yup.string()
          .required('Cannot submit empty supplier field')
        )
        .min(1, 'Must add at least 1 supplier'),
    }),
  });

  return (
    <MessageLayout>
      <Container>
        <h1>Create a new RFP</h1>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="RFP Description"
              onChange={formik.handleChange}
              value={formik.values.description}
              name="description"
              className={classes.field}
            />
            <ErrorMessage
              name="description"
              render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
            />
            <Field name="dateDeadline" label="Proposal Deadline" component={DatePickerField} />
            <AddSKUField formik={formik} />
            <AddSuppliersField formik={formik} partners={data.myPartners} />
            <Button type="submit">Send RFP</Button>
          </form>
        </FormikProvider>
      </Container>
    </MessageLayout>
  );
};

export default CreateRFP;
