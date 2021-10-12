import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import HeaderRow from './HeaderRow';
import Row from './Row';
import NoNotices from './NoNotices';

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

const NoticesTable = props => {
  const classes = useStyles();
  const { columns, options, notices = [] } = props;

  if (!notices.length) {
    return <NoNotices />;
  }

  const categoryOverrides = {
    proposal: 'rfp',
    msa: 'contracts',
    po: 'purchase-order',
  };

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
        <HeaderRow columns={columns} options={options} />
        <TableBody>
          {notices.map(row => {
            return (
              <Row
                key={`row-${row[options.key]}`}
                categoryOverrides={categoryOverrides}
                row={row}
                rows={notices}
                {...props}
              />
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

NoticesTable.propTypes = {
  notices: PropTypes.arrayOf(PropTypes.shape({})),
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  options: PropTypes.shape({
    key: PropTypes.string.isRequired,
  }).isRequired,
};

NoticesTable.defaultProps = {
  notices: [],
};

export default NoticesTable;
