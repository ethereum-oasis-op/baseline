import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useFormik, FieldArray, Field, FormikProvider, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import findIndex from 'lodash/findIndex';
import { useHistory } from 'react-router-dom';
import { ProposalContext } from '../contexts/proposal-context';
import TextField from './TextField';
import GreaterThanIcon from './GreaterThanIcon';
import DropDown from './DropDown';

const useStyles = makeStyles(() => ({
  table: {
    marginBottom: '2rem',
  },
  tableCell: {
    borderBottom: 'none',
  },
  tableCellButton: {
    borderTop: '1px solid rgba(224, 224, 224, 1)',
  },
  circleIcon: {
    margin: '0.5rem',
  },
  errorMessage: {
    color: 'red',
  },
}));

const ProposalForm = ({ rfp }) => {
  const classes = useStyles();
  const history = useHistory();
  const [disabled, setDisabled] = useState({});
  const [contractAddress, setContractAddress] = useState('');
  const { postProposal } = useContext(ProposalContext);

  const erc20contracts = [{
    value: '',
    label: 'Select payment token'
  },
  {
    value: '0x1234',
    label: 'USD',
  },
  {
    value: '0x3451',
    label: 'GBP',
  },
  {
    value: '0x4562',
    label: 'EUR',
  }];

  const formik = useFormik({
    initialValues: {
      rates: [],
      rfpId: rfp._id,
      recipient: rfp.sender,
      erc20ContractAddress: '',
    },
    onSubmit: async values => {
      await postProposal({ variables: { input: values } });
      history.push('/notices/outbox');
    },
    validationSchema: Yup.lazy(values => {
      return Yup.object().shape({
        rates: Yup.array()
          .of(
            Yup.object().shape({
              endRange: Yup.number()
                .required('Volume required')
                .min(1, 'Volume must be at least 1')
                .test({
                  name: 'volume-amount-test',
                  test: item => {
                    const index = findIndex(values.rates, value =>
                      value ? Number(value.endRange) === item : false,
                    );
                    const prevItem = values.rates[index - 1];
                    return prevItem ? prevItem.endRange < item : true;
                  },
                  message: 'Max volume must be higher than previous row',
                  exclusive: false,
                }),
              price: Yup.number().required('Price Required'),
            }),
          )
          .min(1, 'Must add at least 1 rate'),
          erc20ContractAddress: Yup.string().required('Token type required'),
      });
    }),
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Volume</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Payment Token</TableCell>
              <TableCell>Unit of Measure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <FieldArray
              name="rates"
              render={arrayHelpers => (
                <>
                  {formik.values.rates &&
                    formik.values.rates.length > 0 &&
                    formik.values.rates.map((rate, index) => (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>
                            <Field
                              name={`rates.${index}.endRange`}
                              component={TextField}
                              onChange={(e, v) => {
                                if (index === 0)
                                  formik.setFieldValue(`rates.${index}.startRange`, 0);
                                else
                                  formik.setFieldValue(
                                    `rates.${index}.startRange`,
                                    formik.values.rates[index - 1].endRange + 1,
                                  );
                                formik.handleChange(e);
                              }}
                              disabled={disabled[index]}
                              className={classes.field}
                              startadornment={<GreaterThanIcon />}
                              type="number"
                              value={rate.endRange || ''}
                            />
                          </TableCell>
                          <TableCell>
                            <Field
                              name={`rates.${index}.price`}
                              component={TextField}
                              onChange={formik.handleChange}
                              disabled={disabled[index]}
                              className={classes.field}
                              startadornment="$"
                              type="number"
                              value={rate.price || ''}
                            />
                          </TableCell>
                          <TableCell>
                            <Field
                              name='erc20ContractAddress'
                              component={DropDown}
                              disabled={disabled[index]}
                              className={classes.field}
                              type="string"
                              items={erc20contracts}
                              onChange={(e) => {
                                setContractAddress(e.target.value);
                                formik.handleChange(e);
                              }}
                              value={contractAddress}
                            />
                          </TableCell>
                          <TableCell>
                            <Field
                              name={`rates.${index}.unitOfMeasure`}
                              component={TextField}
                              onChange={formik.handleChange}
                              disabled
                              className={classes.field}
                              value="Price Per Unit"
                              type="text"
                            />
                          </TableCell>
                          <TableCell className={index === 0 ? classes.tableCellButton : undefined}>
                            <Button
                              type="button"
                              onClick={() => {
                                setDisabled({ ...disabled, [index]: false });
                                arrayHelpers.remove(index);
                              }}
                            >
                              REMOVE
                            </Button>
                            {!disabled[index] ? (
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    formik.values.rates[index].endRange &&
                                    formik.values.rates[index].price
                                  ) {
                                    setDisabled({ ...disabled, [index]: true });
                                    formik.setFieldValue(
                                      `rates.${index}.unitOfMeasure`,
                                      'Price Per Unit',
                                    );
                                  }
                                }}
                              >
                                ADD
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={() => setDisabled({ ...disabled, [index]: false })}
                              >
                                EDIT
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableCell}>
                            <ErrorMessage
                              name={`rates.${index}.endRange`}
                              render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
                            />
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            <ErrorMessage
                              name={`rates.${index}.price`}
                              render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
                            />
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            <ErrorMessage
                                name='erc20ContractAddress'
                                render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
                              />
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  {formik.values.rates.length < 3 && (
                    <TableRow>
                      <TableCell className={classes.tableCell}>
                        <Button
                          type="button"
                          onClick={() => !formik.values.rates.includes('') && arrayHelpers.push('')}
                          style={{ color: '#50A75D' }}
                        >
                          <AddCircleOutline />
                          Add Tier
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      <ErrorMessage
                        name="rates"
                        render={error => !Array.isArray(error) && <Typography className={classes.errorMessage}>{error}</Typography>}
                      />
                    </TableCell>
                  </TableRow>
                </>
              )}
            />
          </TableBody>
        </Table>
        <Grid container direction="column">
          <Grid item>
            <Button style={{ marginTop: '.5rem' }} type="submit">Send Proposal</Button>
          </Grid>
        </Grid>
      </form>
    </FormikProvider>
  );
};

ProposalForm.propTypes = {
  rfp: PropTypes.shape({}).isRequired,
};

export default ProposalForm;
