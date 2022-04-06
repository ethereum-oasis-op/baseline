import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import {
  SortingState,
  IntegratedSorting,
  SelectionState,
  PagingState,
  IntegratedFiltering,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

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
    fontSize: '1rem',
  },
  filter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const PartnerTable = ({ partners, myPartners, deletePartner, postPartner }) => {
  const classes = useStyles();
  const [organizations] = useState(partners);
  const [rows, setRows] = useState(organizations);
  const [columns] = useState([
    {
      name: 'name',
      numeric: false,
      disablePadding: true,
      title: 'Company',
    },
    {
      name: 'address',
      numeric: false,
      disablePadding: false,
      title: 'Address',
    },
    { name: 'role', numeric: false, disablePadding: false, title: 'Role' },
  ]);
  const roles = ['all companies', 'buyer', 'supplier', 'carrier'];
  const [filterOption, setFilterOption] = useState('');
  const [currentSelections, setSelection] = useState([]);
  const [filteredByRoleOrg, setFilteredByRoleOrg] = useState(null);
  const [filteredByInputOrg, setFilteredByInputOrg] = useState('');
  const [orgList, setOrgList] = useState([]);
  const [currentInput, setCurrentInput] = useState('');

  // set the orgList to the most filtered list
  useEffect(() => {
    let filteredOrgs;
    if (filteredByRoleOrg && filteredByInputOrg) {
      filteredOrgs =
        filteredByRoleOrg.length >= filteredByInputOrg.length
          ? filteredByInputOrg
          : filteredByRoleOrg;
    } else if (!filteredByRoleOrg && filteredByInputOrg) {
      filteredOrgs = filteredByInputOrg;
    } else if (filteredByRoleOrg && !filteredByInputOrg) {
      filteredOrgs = filteredByRoleOrg;
    } else {
      filteredOrgs = organizations;
    }
    setOrgList(filteredOrgs);
  }, [filteredByRoleOrg, filteredByInputOrg, organizations]);

  // in current orgList(filtered or whole list), see if partners there, if so, find index of it and put it in setSelection
  useEffect(() => {
    const currentSelectionsIndex = myPartners
      .map(partner => {
        const index = orgList.findIndex(organization => {
          return organization.address === partner.address;
        });
        return index;
      })
      .filter(ind => ind !== -1);
    setSelection(currentSelectionsIndex);
  }, [orgList, myPartners]);

  const handleSelection = async selectedRows => {
    // checks if is unselect, then remove partner from the list
    if (currentSelections.length > selectedRows.length) {
      const removePartner = _.omit(orgList[_.difference(currentSelections, selectedRows)], [
        '__typename',
      ]);
      await deletePartner({ variables: { input: removePartner } });
    }
    // checks if is select, then add partner to the list
    if (currentSelections.length < selectedRows.length) {
      const newPartner = _.omit(orgList[selectedRows[selectedRows.length - 1]], ['__typename']);
      await postPartner({ variables: { input: newPartner } });
    }
    setSelection(selectedRows);
  };

  useEffect(() => {
    let filteredOrgs;
    // If the organization list is already filtered by role, filter within that list
    if (filteredByRoleOrg) {
      filteredOrgs =
        currentInput === ''
          ? filteredByRoleOrg
          : filteredByRoleOrg.filter(organization =>
              organization.name.toLowerCase().includes(currentInput.toLowerCase()),
            );
    } else {
      filteredOrgs =
        currentInput === ''
          ? organizations
          : organizations.filter(organization =>
              organization.name.toLowerCase().includes(currentInput.toLowerCase()),
            );
    }
    setFilteredByInputOrg(filteredOrgs);
    setRows(filteredOrgs);
  }, [currentInput, organizations, filteredByRoleOrg]);

  const handleRoleChange = event => {
    setFilterOption(event.target.value);
    const filteredOrgs =
      event.target.value === 'all companies'
        ? organizations
        : organizations.filter(organization => {
            return organization.role === event.target.value;
          });
    setFilteredByRoleOrg(filteredOrgs);
    setRows(filteredOrgs);
    if (currentInput) {
      setCurrentInput(currentInput);
    }
  };

  return (
    <>
      <Typography variant="h4">Registry</Typography>
      <div className={classes.filter}>
        <TextField
          id="standard-dense"
          label="Search by Company"
          className={classes.textField}
          margin="normal"
          onChange={event => setCurrentInput(event.target.value)}
        />

        <TextField
          id="outlined-select-role"
          select
          label="Sort By Role"
          className={classes.textField}
          value={filterOption}
          onChange={handleRoleChange}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Please select filter option"
          margin="normal"
        >
          {roles.map(role => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <Paper>
        <Grid rows={rows} columns={columns}>
          <SelectionState selection={currentSelections} onSelectionChange={handleSelection} />

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
    </>
  );
};

PartnerTable.propTypes = {
  partners: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  myPartners: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  deletePartner: PropTypes.func.isRequired,
  postPartner: PropTypes.func.isRequired,
};

export default PartnerTable;
