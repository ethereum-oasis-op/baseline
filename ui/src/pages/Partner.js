import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { UserContext } from '../contexts/user-context'
import { PartnerContext } from '../contexts/partner-context'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { NavLink } from 'react-router-dom'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import PartnerTable from '../components/PartnerTable'

const PARTNERS_QUERY = gql`
  {
    organizations {
      name
      address
      role
    }
  }
`

const useStyles = makeStyles(() => ({
  root: {
    textDecoration: 'none'
  },
  list: {
    paddingTop: 0
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem'
  },
  selected: {
    display: 'block',
    background: '#dfe4e8'
  },
  location: {
    float: 'right'
  },
  subheader: {
    padding: 0
  }
}))

const removeMyOrg = (data, user) => {
  console.log('(((((', data)
  const { organizations } = data
  const filteredData = organizations.filter(organization => {
    return organization.address !== user.address
  })
  console.log('!!!!', filteredData)
  return {organizations: filteredData}
}

const PartnerListItem = ({ name, address, role }) => {
  const classes = useStyles()
  // const { organizations } = useContext(PartnerContext)

  // console.log(organizations)

  return (
    <NavLink
      exact
      to={`/partners/${name}`}
      className={classes.root}
      activeClassName={classes.selected}
    >
      <span className={classes.item}>
        <Typography color="textPrimary">
          <Typography variant="caption" gutterBottom>
            Role - {role}
          </Typography>
          <br/>
            <Typography variant="body" gutterBottom>
              {name}
            </Typography>
          <br/>
          <Typography
            variant="caption"
            className={classes.address}
            gutterBottom
          >
            {address}
          </Typography>
        </Typography>
      </span>
      <Divider />
    </NavLink>
  )
}

const Partner = () => {
  return (
    <PartnerContext.Consumer>
      {({ data, partners, update }) => (
        <Layout scroll>
          <Sidebar>
            <h2>Active Partners</h2>
            {partners.length ? (
              <List>
                {partners.map(data => (
                  <PartnerListItem key={data.name} {...data} />
                ))}
              </List>
            ) : (
              <Typography>No active partners</Typography>
            )}
          </Sidebar>
          <Container fixed>
            <React.Fragment>
              <Query query={PARTNERS_QUERY}>
                {({ loading, error, data }) => {
                  if (loading) return <h4>Loading...</h4>
                  if (error) return error
                  return (
                    <UserContext.Consumer>
                      {({ user }) => (
                        <React.Fragment>
                          {/* <h1>Registry</h1> */}
                          <PartnerTable
                            data={removeMyOrg(data, user)}
                            selections={partners}
                            update={update}
                          />
                        </React.Fragment>
                      )}
                    </UserContext.Consumer>
                  )
                }}
              </Query>
            </React.Fragment>
          </Container>
        </Layout>
      )}
    </PartnerContext.Consumer>
  )
}

PartnerListItem.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired
}

export default Partner
