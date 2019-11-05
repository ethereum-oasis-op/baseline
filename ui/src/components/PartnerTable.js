import React, { useState, useEffect, useContext } from 'react';
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
import { PartnerContext } from '../contexts/partner-context';

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

let currentSelectionsIndex;
let filteredByRoleOrg;
let filteredByInputOrg;
let currentInput;
let orgList;

const PartnerTable = ({ partners, myPartners, deletePartner }) => {
  const classes = useStyles();
  const { postPartner } = useContext(PartnerContext);
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

  // set the orgList to the most filtered list
  if (filteredByRoleOrg && filteredByInputOrg) {
    orgList =
      filteredByRoleOrg.length >= filteredByInputOrg.length
        ? filteredByInputOrg
        : filteredByRoleOrg;
  } else if (!filteredByRoleOrg && filteredByInputOrg) {
    orgList = filteredByInputOrg;
  } else if (filteredByRoleOrg && !filteredByInputOrg) {
    orgList = filteredByRoleOrg;
  } else {
    orgList = organizations;
  }

  // in current orgList(filtered or whole list), see if partners there, if so, find index of it and put it in setSelection
  useEffect(() => {
    currentSelectionsIndex = myPartners
      .map(partner => {
        const index = orgList.findIndex(organization => {
          return organization.address === partner.address;
        });
        return index;
      })
      .filter(ind => ind !== -1);
    setSelection(currentSelectionsIndex);
  }, [orgList]);

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

  // for Search by Company
  const handleInputChange = event => {
    currentInput = event.target ? event.target.value : currentInput;
    // If the organization list is already filtered by role, filter within that list
    if (filteredByRoleOrg) {
      filteredByInputOrg =
        currentInput === ''
          ? filteredByRoleOrg
          : filteredByRoleOrg.filter(organization =>
              organization.name.toLowerCase().includes(currentInput.toLowerCase()),
            );
    } else {
      filteredByInputOrg =
        currentInput === ''
          ? organizations
          : organizations.filter(organization =>
              organization.name.toLowerCase().includes(currentInput.toLowerCase()),
            );
    }
    setRows(filteredByInputOrg);
  };

  const handleRoleChange = event => {
    setFilterOption(event.target.value);
    filteredByRoleOrg =
      event.target.value === 'all companies'
        ? organizations
        : organizations.filter(organization => {
            return organization.role === event.target.value;
          });
    setRows(filteredByRoleOrg);
    if (currentInput) {
      handleInputChange(currentInput);
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
          onChange={handleInputChange}
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
  myPartners: PropTypes.func.isRequired,
  deletePartner: PropTypes.func.isRequired,
};

export default PartnerTable;
