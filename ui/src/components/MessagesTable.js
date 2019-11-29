import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { MessageContext } from '../contexts/message-context';

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

const checkClasses = (classes, props = {}) => {
  const classnames = {};

  if (classes) {
    Object.entries(classes).forEach(([cl, fn]) => {
      if (typeof fn === 'boolean') {
        classnames[cl] = fn;
      } else if (typeof fn === 'function') {
        const value =
          props && props.row && props.column && props.column.name
            ? props.row[props.column.name]
            : null;
        classnames[cl] = fn(value, props);
      } else {
        classnames[cl] = false;
      }
    });
  }
  return classnames;
};

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

const HeaderCell = ({ column }) => {
  const { label, headerCellClasses } = column;
  const classes = useStyles();
  const headerCellClassnames = checkClasses(headerCellClasses);
  const classnames = classNames(classes.headerCell, headerCellClassnames);

  const value = column.headerFormatter ? column.headerFormatter(label, column) : column.label;

  const content = column.headerComponent ? (
    <column.headerComponent value={value}>{value}</column.headerComponent>
  ) : (
    <>{value}</>
  );

  return (
    <TableCell className={classnames} align={column.align ? column.align : 'left'}>
      {content}
    </TableCell>
  );
};

HeaderCell.propTypes = {
  column: PropTypes.shape({
    label: PropTypes.string.isRequired,
    headerFormatter: PropTypes.func,
    headerCellClasses: PropTypes.shape({}),
    headerComponent: PropTypes.element,
    align: PropTypes.oneOf(['left', 'right', 'center']),
  }).isRequired,
};

const Row = props => {
  const { columns, row, rows, options } = props;
  const classes = useStyles();
  const key = row[options.key];
  const rowClassnames = checkClasses(options.rowClasses, { row });
  const rowClasses = classNames(classes.row, rowClassnames);

  return (
    <TableRow className={rowClasses}>
      {columns.map(column => {
        const data = { column, columns, row, rows, options };
        const columnClassnames = checkClasses(column.columnClasses, data);
        const cellClassnames = checkClasses(column.cellClasses, data);
        const cellClasses = classNames(columnClassnames, cellClassnames);

        const value = column.formatter
          ? column.formatter(row[column.name], props)
          : row[column.name];

        const content = column.component ? (
          <column.component value={value} {...props}>
            {value}
          </column.component>
        ) : (
          <>{value}</>
        );

        return (
          <TableCell
            key={`row-${key}-cell-${column.name}`}
            className={cellClasses}
            align={column.align ? column.align : 'left'}
          >
            <div className={classes.truncate}>{content}</div>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

Row.propTypes = {
  row: PropTypes.shape({}).isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  options: PropTypes.shape({
    key: PropTypes.string.isRequired,
    rowClasses: PropTypes.shape({}),
  }).isRequired,
};

const MessagesTable = props => {
  const classes = useStyles();
  const { messages } = useContext(MessageContext);
  const { columns, options } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
        <HeaderRow columns={columns} options={options} />
        <TableBody>
          {messages.map(row => (
            <Row key={`row-${row[options.key]}`} row={row} {...props} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

MessagesTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  options: PropTypes.shape({
    key: PropTypes.string.isRequired,
  }).isRequired,
};

export default MessagesTable;
