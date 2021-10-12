import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import { checkClasses } from './utils';

const useStyles = makeStyles(() => ({
  headerCell: {},
}));

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

export default HeaderCell;
