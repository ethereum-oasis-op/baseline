import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Inbox from '@material-ui/icons/Inbox';
import Send from '@material-ui/icons/Send';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ProfileSection from './ProfileSection';
import Link from './Link';

const useStyles = makeStyles(() => ({
  root: {
    overflowX: 'scroll',
    maxHeight: '100%',
    width: '100%',
    background: '#f8fafb',
    height: '100vh',
    marginTop: '10%',
  },
  icon: {
    marginRight: '0.5rem',
    position: 'relative',
    top: '0.2rem',
  },
  filterList: {
    marginTop: '10%',
  },
  text: {
    fontWeight: 'bold',
  },
  inboxOutbox: {
    marginLeft: '7%',
    marginBottom: '1rem',
    marginTop: '1rem',
  },
}));

const SideNav = props => {
  const classes = useStyles();

  const { filters } = props;

  return (
    <section className={classes.root}>
      <ProfileSection />
      <hr />
      <section className={classes.inboxOutbox}>
        <Typography className={classes.text}>
          <Inbox className={classes.icon} />
          Inbox (72) {/* notifications.length */}
        </Typography>
        <Typography className={classes.text}>
          <Send className={classes.icon} />
          Sent (42) {/* notifications.length */}
        </Typography>
      </section>
      <hr />
      <List className={classes.filterList}>
        {filters.map(filter => (
          <ListItem key={filter.url}>
            {filter.component ? (
              filter.component
            ) : (
              <Link to={filter.url}>
                <Typography className={classes.text}>
                  <KeyboardArrowRight className={classes.icon} />
                  {filter.label}
                </Typography>
              </Link>
            )}
          </ListItem>
        ))}
      </List>
    </section>
  );
};

SideNav.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default SideNav;
