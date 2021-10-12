import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import HeaderCell from './HeaderCell';
import { checkClasses } from './utils';

const useStyles = makeStyles(() => ({
  root: {},
  table: {
    tableLayout: 'fixed',
  },
  row: {
    '&:hover': {
      boxShadow: `inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)`,
      zIndex: 1,
    },
  },
  headerRow: {},
  headerCell: {},
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const HeaderRow = ({ columns, options }) => {
  const classes = useStyles();
  const headerRowClasses = checkClasses(options.headerRowClasses);
  const classnames = classNames(classes.headerRow, headerRowClasses);

  return (
    <TableHead>
      <TableRow className={classnames}>
        {columns.map(column => (
          <HeaderCell key={`col-${column.name}`} column={column} options={options} />
        ))}
      </TableRow>
    </TableHead>
  );
};

HeaderRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    key: PropTypes.string.isRequired,
    rowClasses: PropTypes.shape({}),
    headerRowClasses: PropTypes.shape({}),
  }).isRequired,
};

export default HeaderRow;
