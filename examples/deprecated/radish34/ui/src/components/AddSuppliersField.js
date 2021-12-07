import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FieldArray, ErrorMessage } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Add from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import find from 'lodash/find';

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
  icon: {
    margin: '0.5rem',
  },
  errorMessage: {
    color: 'red',
  },
  button: {
    color: '#007BFF',
  },
}));

const AddSuppliersField = ({ formik, suppliers }) => {
  const classes = useStyles();
  const [disabled, setDisabled] = useState({});

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Supplier</TableCell>
        </TableRow>
      </TableHead>
      <FieldArray
        name="recipients"
        render={arrayHelpers => (
          <TableBody>
            {formik.values.recipients &&
              formik.values.recipients.length > 0 &&
              formik.values.recipients.map((supplier, index) => (
                <TableRow key={index}>
                  <TableCell className={classes.tableCell}>
                    <Autocomplete
                      options={suppliers}
                      getOptionLabel={partner => partner.name}
                      disabled={disabled[index]}
                      onChange={(e, v) => {
                        const { __typename, ...partner } = v;
                        if (!find(formik.values.recipients, partner.name)) {
                          formik.setFieldValue(`recipients.${index}.partner`, partner);
                        }
                      }}
                      renderInput={params => <TextField {...params} fullWidth />}
                    />
                  </TableCell>
                  <TableCell
                    className={
                      index === 0
                        ? `${classes.tableCell} ${classes.tableCellButton}`
                        : classes.tableCell
                    }
                  >
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
                          formik.values.recipients[index] !== '' &&
                          setDisabled({ ...disabled, [index]: true })
                        }
                        disabled={formik.values.recipients[index] === ''}
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
              ))}
            <TableRow>
              <TableCell className={classes.tableCell}>
                <Button
                  type="button"
                  className={classes.button}
                  onClick={() => !formik.values.recipients.includes('') && arrayHelpers.push('')}
                >
                  <Add className={classes.icon} />
                  Add Supplier
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell}>
                <ErrorMessage
                  name="recipients"
                  render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      />
    </Table>
  );
};

AddSuppliersField.propTypes = {
  formik: PropTypes.shape({}).isRequired,
  suppliers: PropTypes.arrayOf(PropTypes.shape({})),
};

AddSuppliersField.defaultProps = {
  suppliers: [],
};

export default AddSuppliersField;
