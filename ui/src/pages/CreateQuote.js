import React, { useState, useContext } from 'react';
import { useFormik, FieldArray, Field, FormikProvider, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import findIndex from 'lodash/findIndex';
import { useHistory, useParams } from 'react-router-dom';
import DatePickerField from '../components/DatePickerField';
import MessageLayout from '../components/MessageLayout';
import { QuoteContext } from '../contexts/quote-context';

const useStyles = makeStyles(() => ({
  table: {
    marginBottom: '2rem',
  },
  tableCell: {
    borderBottom: 'none',
  },
  field: {
    width: '100%',
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

const CreateQuote = () => {
  const classes = useStyles();
  const history = useHistory();
  const { rfqId } = useParams();
  const [disabled, setDisabled] = useState({});
  const { postQuote } = useContext(QuoteContext);

  const formik = useFormik({
    initialValues: {
      terminationDate: moment(Date.now()),
      rates: [],
      rfqId: Number(rfqId),
    },
    onSubmit: async values => {
      await postQuote({ variables: { input: values } });
      history.push('/messages/outbox');
    },
    validationSchema: Yup.lazy(values => {
      const today = moment(Date.now());
      return Yup.object().shape({
        terminationDate: Yup.date().required().min(today, `Date must be later than ${today.format('MM/DD/YYYY')}`),
        rates: Yup.array()
          .of(
            Yup.object().shape({
              startRange: Yup.number()
                .required('Minimum volume required')
                .min(1, 'Min volume must be at least 1')
                .test({
                  name: 'min-volume-amount-test',
                  test: item => {
                    const index = findIndex(values.rates, value => value ? Number(value.startRange) === item : false);
                    const prevItem = values.rates[index - 1];
                    return prevItem ? prevItem.endRange < item : true;
                  },
                  message: 'Min volume must be higher than previous row',
                  exclusive: false,
                }),
              endRange: Yup.number()
                .required('Maximum volume required')
                .min(1, 'Max volume must be at least 1')
                .test({
                  name: 'max-volume-amount-test',
                  test: item => {
                    const index = findIndex(values.rates, value => value ? Number(value.endRange) === item : false);
                    const prevItem = values.rates[index - 1];
                    return prevItem ? prevItem.endRange < item : true;
                  },
                  message: 'Max volume must be higher than previous row',
                  exclusive: false,
                }),
              ppu: Yup.number()
                .required('PPU Required')
            })
          )
          .min(1, 'Must add at least 1 rate'),
        })
    })
  });
  return (
    <MessageLayout>
      <Container>
        <h1>Create a new Quote</h1>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} style={{ margin: '2rem' }}>
            <Field name="terminationDate" label="Termination Date" component={DatePickerField} />
            <ErrorMessage
              className={classes.errorMessage}
              name="terminationDate"
              render={msg => <Typography>{msg}</Typography>}
            />
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Min Volume</TableCell>
                  <TableCell>Max Volume</TableCell>
                  <TableCell>Price Per Unit (PPU)</TableCell>
                </TableRow>
              </TableHead>
              <FieldArray
                name="rates"
                render={arrayHelpers => (
                  <TableBody>
                    {formik.values.rates &&
                      formik.values.rates.length > 0 && 
                      formik.values.rates.map((rate, index) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              <Field
                                id={`rates.${index}.startRange`}
                                component={TextField}
                                onChange={formik.handleChange}
                                disabled={disabled[index]}
                                className={classes.field}
                                type="number"
                              />
                            </TableCell>
                            <TableCell>
                              <Field
                                id={`rates.${index}.endRange`}
                                component={TextField}
                                onChange={formik.handleChange}
                                disabled={disabled[index]}
                                className={classes.field}
                                type="number"
                              />
                            </TableCell>
                            <TableCell>
                              <Field
                                id={`rates.${index}.ppu`}
                                component={TextField}
                                onChange={formik.handleChange}
                                disabled={disabled[index]}
                                className={classes.field}
                                type="number"
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
                                  onClick={() =>
                                    Boolean(formik.values.rates[index].startRange && formik.values.rates[index].endRange && formik.values.rates[index].ppu) &&
                                    setDisabled({ ...disabled, [index]: true })
                                  }
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
                                className={classes.errorMessage}
                                name={`rates.${index}.startRange`}
                                render={msg => <Typography>{msg}</Typography>}
                              />
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              <ErrorMessage
                                className={classes.errorMessage}
                                name={`rates.${index}.endRange`}
                                render={msg => <Typography>{msg}</Typography>}
                              />
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              <ErrorMessage
                                className={classes.errorMessage}
                                name={`rates.${index}.ppu`}
                                render={msg => <Typography>{msg}</Typography>}
                              />
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    <TableRow>
                      <TableCell className={classes.tableCell}>
                        <Button
                          type="button"
                          onClick={() => !formik.values.rates.includes('') && arrayHelpers.push('')}
                        >
                          <AddCircleOutline />
                          Add Rates
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableCell}>
                        <ErrorMessage
                          className={classes.errorMessage}
                          name='rates'
                          render={error => !Array.isArray(error) && <Typography>{error}</Typography>}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              />
            </Table>
            <Button type="submit">Send Quote</Button>
          </form>
        </FormikProvider>
      </Container>
    </MessageLayout>
  );
};

export default CreateQuote;
