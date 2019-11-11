import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Route, Switch, NavLink } from 'react-router-dom';
import List from '@material-ui/core/List';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import SidebarButton from '../components/SidebarButton';
import PageWrapper from '../components/PageWrapper';
import RFQDetail from './RFQDetail';

const useStyles = makeStyles(theme => ({
  root: {
    textDecoration: 'none',
  },
  list: {
    paddingTop: 0,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
  },
  selected: {
    display: 'block',
    background: '#dfe4e8',
  },
  time: {
    float: 'right',
  },
  subheader: {
    padding: 0,
  },
}));

const rfqs = [
  { rfqid: '99999', time: '0', name: 'VG Chip Replacement', sent: 3, received: 2 },
  { rfqid: '33333', time: '1', name: 'VG1 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '22222', time: '2', name: 'VG2 Chip Replacement', sent: 4, received: 2 },
  { rfqid: '11111', time: '3', name: 'VG3 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '88888', time: '4', name: 'VG4 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '99999', time: '0', name: 'VG Chip Replacement', sent: 3, received: 2 },
  { rfqid: '33333', time: '1', name: 'VG1 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '22222', time: '2', name: 'VG2 Chip Replacement', sent: 4, received: 2 },
  { rfqid: '11111', time: '3', name: 'VG3 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '88888', time: '4', name: 'VG4 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '99999', time: '0', name: 'VG Chip Replacement', sent: 3, received: 2 },
  { rfqid: '33333', time: '1', name: 'VG1 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '22222', time: '2', name: 'VG2 Chip Replacement', sent: 4, received: 2 },
  { rfqid: '11111', time: '3', name: 'VG3 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '88888', time: '4', name: 'VG4 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '99999', time: '0', name: 'VG Chip Replacement', sent: 3, received: 2 },
  { rfqid: '33333', time: '1', name: 'VG1 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '22222', time: '2', name: 'VG2 Chip Replacement', sent: 4, received: 2 },
  { rfqid: '11111', time: '3', name: 'VG3 Chip Replacement', sent: 3, received: 2 },
  { rfqid: '88888', time: '4', name: 'VG4 Chip Replacement', sent: 3, received: 2 },
];

const RFQListItem = ({ rfqid, time, name, sent, received }) => {
  const classes = useStyles();

  return (
    <NavLink exact to={`/rfq/${rfqid}`} className={classes.root} activeClassName={classes.selected}>
      <span className={classes.item}>
        <Typography color="textPrimary">
          <Typography variant="caption" gutterBottom>
            RFQ ID - {rfqid}
          </Typography>
          <Typography variant="caption" className={classes.time} gutterBottom>
            {time}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {name}
          </Typography>
          <Typography variant="caption" gutterBottom>
            {sent} Sent
          </Typography>
          <Typography variant="caption" gutterBottom>
            {received} Received
          </Typography>
        </Typography>
      </span>
      <Divider />
    </NavLink>
  );
};

const RFQ = () => {
  const classes = useStyles();
  const items = rfqs.map(data => <RFQListItem {...data} />);

  return (
    <Layout>
      <Sidebar>
        <List className={classes.list}>
          <SidebarButton label="Create New Request" to="/rfq/new" />
          {items}
        </List>
      </Sidebar>
      <PageWrapper>
        <Switch>
          <Route exact path="/rfq/:id" component={RFQDetail} />
          <Route exact path="/rfq" component={RFQDetail} />
        </Switch>
      </PageWrapper>
    </Layout>
  );
};

export default RFQ;
