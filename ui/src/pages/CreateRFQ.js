import React, { useContext } from 'react';
import { useFormik, Field, FormikProvider, ErrorMessage } from 'formik';
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
import { RFQContext } from '../contexts/rfq-context';
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

const CreateRFQ = () => {
  const classes = useStyles();
  const { postRFQ } = useContext(RFQContext);
  const { data } = useContext(PartnerContext);

  const formik = useFormik({
    initialValues: {
      description: '',
      dateDeadline: moment(Date.now()),
      sku: '',
      skuDescription: '',
      suppliers: [],
    },
    onSubmit: values => {
      postRFQ(values);
      alert(JSON.stringify(values, null, 2));
    },
    validationSchema: Yup.object().shape({
      description: Yup.string().required('RFQ Description required'),
      sku: Yup.string().required('Input SKU number'),
      suppliers: Yup.array().min(1, 'Must add at least 1 supplier'),
    }),
  });

  return (
    <MessageLayout>
      <Container>
        <h1>Create a new RFQ</h1>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="RFQ Description"
              onChange={formik.handleChange}
              value={formik.values.description}
              name="description"
              className={classes.field}
            />
            <ErrorMessage
              name="description"
              render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
            />
            <Field name="dateDeadline" label="Quote Deadline" component={DatePickerField} />
            <AddSKUField formik={formik} />
            <AddSuppliersField formik={formik} partners={data.myPartners} />
            <Button type="submit">Send RFQ</Button>
          </form>
        </FormikProvider>
      </Container>
    </MessageLayout>
  );
};

export default CreateRFQ;
