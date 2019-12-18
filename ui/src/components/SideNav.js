import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { NavLink, useHistory } from 'react-router-dom';
import Inbox from '@material-ui/icons/Inbox';
import Send from '@material-ui/icons/Send';
import { groupBy, filter } from 'lodash';
import DropDown from './DropDown';

const useStyles = makeStyles(() => ({
  root: {
    overflowX: 'scroll',
    maxHeight: '100%',
    width: '100%',
    background: '#f8fafb',
    height: '100vh',
    marginTop: '1rem',
  },
  filterList: {
    marginTop: 0,
    paddingTop: 0,
    '.MuiFormControl-root': {
      margin: 0,
    }
  },
  createNewButton: {
    border: '1px solid red',
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
    marginLeft: '1rem',
  },
  label: {
    flexGrow: 1,
  },
  count: {
    fontWeight: 'normal',
  },
  dot: {
    width: '1rem',
    height: '1rem',
    background: 'silver',
    borderRadius: '10rem',
    margin: '0 .5rem 0 1rem',
    '&.dot-rfp': {
      background: '#F09085',
    },
    '&.dot-proposal': {
      background: '#F9D448',
    },
    '&.dot-purchaseorder': {
      background: '#A6CA72',
    },
    '&.dot-invoice': {
      background: '#5186ED',
    },
  },
}));

const categories = [
  { label: 'RFPs', key: 'rfp', url: '/messages/rfp' },
  { label: 'Proposals', key: 'proposal', url: '/messages/proposal'},
  {
    label: 'Purchase Orders',
    key: 'purchaseorder',
    url: '/messages/purchaseorder',
  },
  { label: 'Invoices', key: 'invoice', url: '/messages/invoice'},
  // { label: 'MSA', key: 'msa', url: '/messages/msa', icon: DescriptionIcon },
  // { label: "Procurement Requests", key: "procurementRequest", url: "/messages/procurementrequest", icon: LibraryBooksIcon },
];

const Category = ({ icon: Icon, label, items = [], name, url, selected }) => {
  const classes = useStyles();
  const unresolved = filter(items, ['resolved', false]);

  return (
    <ListItem className={classes.linkItem}>
      <NavLink
        exact
        to={url}
        className={classes.link}
        activeClassName={classes.selected}
        isActive={() => selected}
      >
        { Icon
          ? <Icon className={classes.icon} />
          : <div className={`${classes.dot} dot-${name}`} />
        }
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
  items: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

Category.defaultProps = {
  selected: false,
};

const SideNav = ({ messages, selected }) => {
  const classes = useStyles();
  const history = useHistory();
  const groups = groupBy(messages, 'category');
  const results = groupBy(messages, 'status');
  const createForms = [
    { value: '/rfp/create', label: 'Create New RFP '},
  ];

  const dropdownOnChange = (e) => history.push(e.target.value);

  return (
    <div className={classes.root}>
      <List className={classes.filterList}>
        <DropDown items={createForms} onChange={dropdownOnChange} className={classes.createNewButton} defaultItem="Create New Item" />
        <Category icon={Inbox} label="Inbox" category={results.incoming} url="/messages/inbox" />
        <Category icon={Send} label="Outbox" category={results.outgoing} url="/messages/outbox" />
      </List>

      <Divider />

      <List className={classes.filterList}>
        {categories.map(({ label, key, url, icon }) => (
          <Category
            icon={icon}
            label={label}
            items={groups[key]}
            name={key}
            url={url}
            selected={key === selected}
          />
        ))}
      </List>

      <Divider />

      <List className={classes.filterList}>
        <Category icon={null} label="Products" url="/products" />
        <Category icon={null} label="Partners" url="/partners" />
        <Category icon={null} label="Contracts" url="/contracts" />
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
