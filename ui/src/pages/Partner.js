import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import { UserContext } from '../contexts/user-context';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';
import { PartnerContext } from '../contexts/partner-context';
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

  const removeMyOrg = (dataList, user) => {
    const { organizations } = dataList;
    const filteredData = organizations.filter(organization => {
      return organization.address !== user.address;
    });
    return filteredData;
  };

  return (
    <PartnerContext.Consumer>
      {({ data, postPartner, deletePartner }) => {
        return (
          <>
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
                  <Typography>No active partners</Typography>
                )}
              </Sidebar>
              <Container fixed>
                <>
                  <UserContext.Consumer>
                    {({ user }) => (
                      <>
                        <PartnerTable
                          partners={removeMyOrg(data, user)}
                          myPartners={data.myPartners}
                          postPartner={postPartner}
                          deletePartner={deletePartner}
                        />
                      </>
                    )}
                  </UserContext.Consumer>
                </>
              </Container>
            </Layout>
          </>
        );
      }}
    </PartnerContext.Consumer>
  );
};

export default Partner;
