import React, { useContext, useEffect, useState } from 'react';
import { useFormik, Field, FormikProvider, ErrorMessage } from 'formik';
import { useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import DatePickerField from '../components/DatePickerField';
import AddSKUField from '../components/AddSKUField';
import MSACardList from '../components/MSACardList';
import { PurchaseOrderContext } from '../contexts/purchase-order-context';
import { ServerSettingsContext } from '../contexts/server-settings-context';
import NoticeLayout from '../components/NoticeLayout';
import { GET_ALL_MSAS } from '../graphql/msa';
import { GET_PARTNER_BY_IDENTITY } from '../graphql/partners';

const useStyles = makeStyles(() => ({
  field: {
    width: '100%',
    marginBottom: '1rem',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '2rem',
  },
  submitButton: {
    background: '#007BFF',
    color: '#FFF',
  },
  paper: {
    position: 'relative',
    padding: '2rem',
    margin: '0 auto',
    width: '95%',
    height: '100%',
    marginTop: '2rem',
  },
}));

const CreatePurchaseOrder = () => {
  const classes = useStyles();
  const [buyerMSAS, setBuyerMSAS] = useState([]);
  const [selectedMSA, setSelectedMSA] = useState();

  const { postPurchaseOrder } = useContext(PurchaseOrderContext);
  const history = useHistory();

  const [fetchMSAS, { data: msaData }] = useLazyQuery(GET_ALL_MSAS);
  const { msas } = msaData ? msaData : {};
  const { settings } = useContext(ServerSettingsContext);
  const { organizationWhisperKey } = settings || {};

  const [getPartnerByMessagingKey, { data: partnerData }] = useLazyQuery(
    GET_PARTNER_BY_IDENTITY,
  );

  const { getPartnerByMessagingKey: currentUser } = partnerData || {};

  const formik = useFormik({
    initialValues: {
      description: '',
      deliveryDate: moment(Date.now()),
      sku: selectedMSA ? selectedMSA.sku : '',
      msaId: selectedMSA ? selectedMSA._id : '',
      volume: 0,
    },
    onSubmit: async values => {
      const { sku, volume, deliveryDate, ...poValues } = values;
      postPurchaseOrder({
        variables: {
          input: {
            ...poValues,
            volume: Number(volume),
            deliveryDate: moment(deliveryDate).unix(),
          },
        },
      });
      history.push('/notices/outbox');
    },
    validationSchema: Yup.object().shape({
      description: Yup.string().required('Input a description'),
      volume: Yup
        .number()
        .required('Purchase Order volume required')
        .min(1, 'Volume cannot be 0')
        .max(
          selectedMSA ? selectedMSA.tierBounds[selectedMSA.tierBounds.length - 1] - selectedMSA.commitments[selectedMSA.commitments.length - 1].variables.accumulatedVolumeOrdered : null,
          "The maximum amount of volume that the supplier has available and that can be ordered under this MSA. The volume submitted may not exceed the the upper volume bound of the MSA rate table"
        ),
      sku: Yup.string().required('Input SKU number'),
      msaId: Yup.string().required('Select an MSA'),
    }),
  });

  useEffect(() => {
    if (!msas) fetchMSAS();
  }, [fetchMSAS, msas]);

  useEffect(() => {
    if (!partnerData && organizationWhisperKey) getPartnerByMessagingKey({ variables: { identity: organizationWhisperKey } });
  }, [getPartnerByMessagingKey, partnerData, organizationWhisperKey]);

  useEffect(() => {
    if (msas && currentUser && !selectedMSA) {
      setBuyerMSAS(msas.filter(msa => msa.zkpPublicKeyOfBuyer === currentUser.zkpPublicKey));
    }
  }, [msas, currentUser, selectedMSA]);

  useEffect(() => {
    if (selectedMSA) {
      setBuyerMSAS(msas => msas.filter(msa => msa.sku === selectedMSA.sku));
    }
  }, [selectedMSA]);

  return (
    <NoticeLayout>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h2">Create a new Purchase Order</Typography>
        {!selectedMSA && <Typography variant="h3">Select MSA To Create a Purchase Order for:</Typography>}
        <MSACardList
          msas={buyerMSAS}
          volume={Number(formik.values.volume)}
          onClick={msa => {
            if (selectedMSA) {
              if (msa._id === selectedMSA._id) {
                setSelectedMSA(null);
                formik.setFieldValue('sku', '');
                formik.setFieldValue('msaId', '');
                return;
              }
            }
            setSelectedMSA(msa);
            formik.setFieldValue('sku', msa.sku);
            formik.setFieldValue('msaId', msa._id);
          }}
          selectedMSAId={selectedMSA ? selectedMSA._id : ''}
        />
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <ErrorMessage
              name="msaId"
              render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
            />
            <TextField
              label="Purchase Order Description"
              onChange={formik.handleChange}
              value={formik.values.description}
              name="description"
              className={classes.field}
            />
            <ErrorMessage
              name="description"
              render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
            />
            <Field name="deliveryDate" label="Delivery Date" component={DatePickerField} />
            <AddSKUField formik={formik} volumeField displayOverride />
            <ErrorMessage
              name="volume"
              render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
            />
            <Button className={classes.submitButton} type="submit">
              Send Purchase Order
            </Button>
          </form>
        </FormikProvider>
      </Paper>
    </NoticeLayout>
  );
};

export default CreatePurchaseOrder;
