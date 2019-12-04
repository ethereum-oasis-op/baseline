import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, ErrorMessage } from 'formik';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  table: {
    marginBottom: '2rem',
    marginTop: '2rem',
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
  errorMessage: {
    color: 'red',
  },
}));

const AddSKUField = ({ formik }) => {
  const classes = useStyles();
  const [disabled, setDisabled] = useState(false);

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>SKU</TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell className={classes.tableCell}>
            <Field
              id="sku"
              component={TextField}
              onChange={formik.handleChange}
              disabled={disabled}
              className={classes.field}
            />
          </TableCell>
          <TableCell className={classes.tableCell}>
            <Field
              id="skuDescription"
              component={TextField}
              onChange={formik.handleChange}
              disabled={disabled}
              className={classes.field}
            />
          </TableCell>
          <TableCell className={`${classes.tableCell} ${classes.tableCellButton}`}>
            {!disabled ? (
              <Button
                type="button"
                onClick={() => setDisabled(true)}
                disabled={formik.values.sku === ''}
              >
                ADD
              </Button>
            ) : (
              <Button type="button" onClick={() => setDisabled(false)}>
                EDIT
              </Button>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className={classes.tableCell}>
            <ErrorMessage
              name="sku"
              render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

AddSKUField.propTypes = {
  formik: PropTypes.shape({}).isRequired,
};

export default AddSKUField;
