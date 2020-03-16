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
import Add from '@material-ui/icons/Add';

const useStyles = makeStyles(() => ({
  table: {
    marginBottom: '2rem',
    marginTop: '2rem',
  },
  borderlessTableCell: {
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
  icon: {
    margin: '0.5rem',
  },
  button: {
    color: '#007BFF',
  },
}));

const AddSKUField = ({ formik, volumeField = false, displayOverride }) => {
  const classes = useStyles();
  const [disabled, setDisabled] = useState(false);
  const [display, setDisplay] = useState(false);

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>SKU</TableCell>
          <TableCell>{volumeField ? 'Volume' : 'Description'}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {display || displayOverride ?
        <TableRow>
        <TableCell>
          <Field
            id="sku"
            component={TextField}
            onChange={formik.handleChange}
            disabled={disabled}
            className={classes.field}
            value={formik.values.sku}
          />
        </TableCell>
        <TableCell>
          {volumeField ?
            <Field
              id="volume"
              component={TextField}
              onChange={formik.handleChange}
              disabled={disabled}
              className={classes.field}
              value={formik.values.volume}
            />
            :
            <Field
              id="skuDescription"
              component={TextField}
              onChange={formik.handleChange}
              disabled={disabled}
              className={classes.field}
            />
          }
        </TableCell>
        <TableCell className={classes.tableCellButton}>
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
          <Button
            type="button"
            onClick={() => setDisplay(false)}
          >
            Remove
          </Button>
        </TableCell>
      </TableRow>
        : 
        <TableRow>
          <TableCell className={classes.borderlessTableCell}>
            <Button className={classes.button} type="button" onClick={() => setDisplay(true)}>
              <Add className={classes.icon} />
              Add Item
            </Button>
          </TableCell>
        </TableRow>
        }
        {Object.keys(formik.errors).length > 0 &&
          <TableRow>
            <TableCell className={classes.borderlessTableCell}>
              <ErrorMessage
                name="sku"
                render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
              />
            </TableCell>
            <TableCell className={classes.borderlessTableCell}>
              <ErrorMessage
                name="skuDescription"
                render={msg => <Typography className={classes.errorMessage}>{msg}</Typography>}
              />
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table>
  );
};

AddSKUField.propTypes = {
  formik: PropTypes.shape({}).isRequired,
};

export default AddSKUField;
