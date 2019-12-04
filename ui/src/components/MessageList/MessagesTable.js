import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import HeaderRow from './HeaderRow';
import Row from './Row';
import NoMessages from './NoMessages';

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

const MessagesTable = props => {
  const classes = useStyles();
  const { columns, options, messages = [] } = props;

  if (!messages.length) {
    return <NoMessages />;
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
        <HeaderRow columns={columns} options={options} />
        <TableBody>
          {messages.map(row => {
            return <Row key={`row-${row[options.key]}`} row={row} rows={messages} {...props} />;
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

MessagesTable.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  options: PropTypes.shape({
    key: PropTypes.string.isRequired,
  }).isRequired,
};

export default MessagesTable;
