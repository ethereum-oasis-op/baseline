import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { NavLink } from 'react-router-dom';
import Inbox from '@material-ui/icons/Inbox';
import Send from '@material-ui/icons/Send';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import DescriptionIcon from '@material-ui/icons/Description';
import { groupBy, filter } from 'lodash';

const useStyles = makeStyles(() => ({
  root: {
    overflowX: 'scroll',
    maxHeight: '100%',
    width: '100%',
    background: '#f8fafb',
    height: '100vh',
    marginTop: '10%',
  },
  filterList: {
    marginTop: 0,
  },
  text: {
    fontWeight: 'bold',
    width: '100%',
    display: 'inline-block',
  },
  inboxOutbox: {
    marginLeft: '7%',
    marginBottom: '1rem',
    marginTop: '1rem',
  },
  badge: {
    width: '100%',
  },
  linkItem: {
    padding: '.2rem',
    paddingLeft: 0,
    paddingRight: '.5rem',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
    fontWeight: 'bold',
    display: 'flex',
    width: '100%',
    padding: '.2rem',
    margin: 0,
    paddingRight: '1rem',
    alignItems: 'center',
    borderRadius: '0 16px 16px 0',
  },
  selected: {
    background: 'rgba(0,0,0,.05)',
  },
  icon: {
    marginRight: '1rem',
  },
  label: {
    flexGrow: 1,
  },
  count: {
    fontWeight: 'normal',
  },
}));

const categories = [
  {
    label: 'Purchase Orders',
    key: 'purchaseorder',
    url: '/messages/purchaseorder',
    icon: ReceiptIcon,
  },
  { label: 'Invoices', key: 'invoice', url: '/messages/invoice', icon: LibraryBooksIcon },
  { label: 'RFQs', key: 'rfq', url: '/messages/rfq', icon: AssignmentIcon },
  { label: 'MSA', key: 'msa', url: '/messages/msa', icon: DescriptionIcon },
  // { label: "Procurement Requests", key: "procurementRequest", url: "/messages/procurementrequest", icon: LibraryBooksIcon },
];

const Category = ({ icon: Icon, label, category = [], url, selected }) => {
  const classes = useStyles();
  const unresolved = filter(category, ['resolved', false]);

  return (
    <ListItem className={classes.linkItem}>
      <NavLink
        exact
        to={url}
        className={classes.link}
        activeClassName={classes.selected}
        isActive={() => selected}
      >
        <Icon className={classes.icon} />
        <div className={classes.label}>{label}</div>
        <div className={classes.count}>{unresolved.length ? unresolved.length : null}</div>
      </NavLink>
    </ListItem>
  );
};

Category.propTypes = {
  selected: PropTypes.bool,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

Category.defaultProps = {
  selected: false,
};

const SideNav = ({ messages, selected }) => {
  const classes = useStyles();
  const groups = groupBy(messages, 'category');
  const results = groupBy(messages, 'status');

  return (
    <div className={classes.root}>
      <List className={classes.filterList}>
        <Category icon={Inbox} label="Inbox" category={results.incoming} url="/messages/inbox" />
        <Category icon={Send} label="Outbox" category={results.outgoing} url="/messages/outbox" />
      </List>

      <Divider />

      <List className={classes.filterList}>
        {categories.map(({ label, key, url, icon }) => (
          <Category
            icon={icon}
            label={label}
            category={groups[key]}
            url={url}
            selected={key === selected}
          />
        ))}
      </List>
    </div>
  );
};

SideNav.propTypes = {
  selected: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

SideNav.defaultProps = {
  selected: '',
};

export default SideNav;
