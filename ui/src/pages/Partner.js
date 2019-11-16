import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import { UserContext } from '../contexts/user-context';
import { PartnerContext } from '../contexts/partner-context';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';
import PartnerTable from '../components/PartnerTable';
import PartnerListItem from '../components/PartnerListItem';

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

const Partner = () => {
  const classes = useStyles();

  const { data, postPartner, deletePartner } = useContext(PartnerContext);
  const { user } = useContext(UserContext);

  const removeMyOrg = (dataList, user) => {
    const { organizations } = dataList;
    const filteredData = organizations.filter(organization => {
      return organization.address !== user.address;
    });
    return filteredData;
  };

  return (
    <Layout scroll>
      <Sidebar>
        <h2 className={classes.textField}>Active Partners</h2>
        {data.myPartners.length ? (
          <List>
            {data.myPartners.map(partner => (
              <PartnerListItem key={partner.name} {...partner} />
            ))}
          </List>
        ) : (
          <Typography className={classes.textField}>
            No active partners
          </Typography>
        )}
      </Sidebar>
      <Container fixed>
        <PartnerTable
          partners={removeMyOrg(data, user)}
          myPartners={data.myPartners}
          postPartner={postPartner}
          deletePartner={deletePartner}
        />
      </Container>
    </Layout>
  );
};

export default Partner;
