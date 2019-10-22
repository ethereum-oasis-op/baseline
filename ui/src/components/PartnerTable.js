import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import {
  SortingState,
  IntegratedSorting,
  SelectionState,
  PagingState,
  IntegratedFiltering,
  IntegratedPaging
} from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  PagingPanel
} from '@devexpress/dx-react-grid-material-ui'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
    fontSize: '1rem'
  },
}));

const PartnerTable = ({ data, selections, update }) => {
  const classes = useStyles();
  const [organizations, setOrganizations] = useState(data.organizations)
  let currentSelectionIndex
  useEffect(
    () => {
      currentSelectionIndex = selections.map(selection => {
        const index = organizations.findIndex(
          organization => organization.name === selection.name
        )
        return index
      })
      setSelection(currentSelectionIndex)
    },
    [organizations]
  )

  const [currentSelection, setSelection] = useState(currentSelectionIndex)
  const [rows, setRows] = useState(organizations)
  const [columns] = useState([
    {
      name: 'name',
      numeric: false,
      disablePadding: true,
      title: 'Company'
    },
    {
      name: 'address',
      numeric: false,
      disablePadding: false,
      title: 'Address'
    },
    { name: 'role', numeric: false, disablePadding: false, title: 'Role' }
  ])
  const [filterSelection, setFilterSelection] = useState('')
  const roles = ['all companies', 'buyer', 'supplier', 'carrier']

  const handleSelection = selectedRows => {
    setSelection(selectedRows)
    const selectedPartners = selectedRows.map(row => {
      return organizations[row]
    })
    update(selectedPartners)
  }
  //////////////////
  let filteredOrgs;
  const handleRoleChange = role => event => {
    setFilterSelection(event.target.value)
   filteredOrgs =
      event.target.value === 'all companies'
        ? data.organizations
        : data.organizations.filter(organization => {
          return organization.role === event.target.value
        })
    setRows(filteredOrgs)
    setOrganizations(filteredOrgs)
    console.log('after handleRoleChange org', organizations)
  }

  const handleInputChange = input => event => {
  
     filteredOrgs = event.target.value === '' ? data.organizations : data.organizations.filter(organization =>
      organization.name.toLowerCase().includes(event.target.value.toLowerCase())
    )
    setRows(filteredOrgs)
    setOrganizations(filteredOrgs)
    console.log(setOrganizations(filteredOrgs))
    console.log('ORG', organizations)   
  }
////////////////////
  return (
    <React.Fragment>
      <Typography variant="h4">Registry</Typography>
      <TextField
        id="standard-dense"
        label="Search by Company"
        className={classes.textField}
        margin="normal"
        onChange={handleInputChange('input')}
      />

        <TextField
        id="outlined-select-role"
        select
        label="Sort By Role"
        className={classes.textField}
        value={filterSelection}
        onChange={handleRoleChange('role')}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        helperText="Please select filter option"
        margin="normal"
        // variant="outlined"
      > 
        {roles.map(role => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>


      <Paper>
        <Grid rows={rows} columns={columns}>
          <SelectionState
            selection={currentSelection}
            onSelectionChange={handleSelection}
          />

          <SortingState />
          <PagingState defaultCurrentPage={0} pageSize={10} />

          <IntegratedSorting />
          <IntegratedFiltering />
          <IntegratedPaging />

          <Table />
          <TableHeaderRow showSortingControls />

          <PagingPanel />
          <TableSelection selectByRowClick />
        </Grid>
      </Paper>
    </React.Fragment>
  )
}

PartnerTable.propTypes = {
  data: PropTypes.shape({
    organizations: PropTypes.arrayOf(PropTypes.shape({})).isRequired
  }).isRequired,
  selections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  update: PropTypes.func.isRequired
}

export default PartnerTable
