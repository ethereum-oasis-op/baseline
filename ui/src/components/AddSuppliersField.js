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
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

const AddSuppliersField = ({ formik, partners }) => {
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
        name="suppliers"
        render={arrayHelpers => (
          <TableBody>
            {formik.values.suppliers &&
              formik.values.suppliers.length > 0 && 
              formik.values.suppliers.map((supplier, index) => (
                <TableRow key={index}>
                  <TableCell className={classes.tableCell}>
                    <Autocomplete
                      options={partners}
                      getOptionLabel={partner => partner.name}
                      disabled={disabled[index]}
                      onChange={e =>
                        !formik.values.suppliers.includes(e.target.textContent) &&
                        formik.setFieldValue(`suppliers.${index}`, e.target.textContent)
                      } 
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
                          formik.values.suppliers[index] !== '' &&
                          setDisabled({ ...disabled, [index]: true })
                        }
                        disabled={formik.values.suppliers[index] === ''}
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
                  onClick={() => !formik.values.suppliers.includes('') && arrayHelpers.push('')}
                >
                  <AddCircleOutline className={classes.circleIcon} />
                  Add Supplier
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell}>
                <ErrorMessage
                  name="suppliers"
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
  partners: PropTypes.arrayOf(PropTypes.shape({})),
};

AddSuppliersField.defaultProps = {
  partners: [],
};

export default AddSuppliersField;
