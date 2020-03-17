import React, { useState, useContext } from 'react';
import { filter } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DataTable from '../components/DataTable/DataTable';
import { PartnerContext } from '../contexts/partner-context';
import NoticeLayout from '../components/NoticeLayout';

const useStyles = makeStyles(() => ({
  searchPartners: {
    padding: '.4rem 0rem .4rem 1rem',
    display: 'flex',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#286AD2',
    },
    '&:active .MuiOutlinedInput-notchedOutline': {
      borderColor: '#286AD2',
    },
  },
  searchPartnersTitle: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    marginRight: '1rem',
    alignItems: 'center',
    display: 'flex',
  },
  searchPartnersInputContainer: {
    flexGrow: 1,
  },
  searchPartnersInput: {
    background: '#EAF4FF',
    marginRight: '1rem',
    borderRadius: '.9rem',
    height: '2.8rem',
    borderColor: 'transparent',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
    },
  },
  searchPartnersInputIcon: {
    width: '1.5rem',
  },
  sortPartners: {
    padding: '.5rem 1rem',
    '& .MuiToggleButton-sizeSmall': {
      height: '1.8rem',
      textTransform: 'none',
    },
    '& .MuiToggleButton-root': {
      borderColor: '#286AD2',
    },
    '& .Mui-selected': {
      background: '#286AD2',
      '& .MuiToggleButton-label': {
        color: 'white',
      },
    },
    '& .MuiToggleButton-label': {
      color: '#286AD2',
    },
  },
  sortPartnersCol1: {
    flexGrow: 1,
  },
  sortPartnersCol2: {
    display: 'flex',
  },
  filterPartners: {
    marginLeft: '1rem',
    borderLeft: '1px solid silver',
    paddingLeft: '1rem',
    '& .MuiInputBase-formControl': {
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiSelect-selectMenu': {
      padding: '.4rem 2rem .4rem 1rem',
      color: '#286AD2',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#286AD2',
    },
  },
  filterInput: {
    height: '1.8rem',
    fontSize: '.8rem',
  },
  expandIcon: {
    position: 'absolute',
    top: '.3rem',
    right: '.3rem',
    color: '#286AD2',
  },
  companyCount: {
    color: '#62737F',
    marginLeft: '1rem',
    fontWeight: 'bold',
  },
}));

const SearchPartners = ({ actions, values }) => {
  const classes = useStyles();
  const { setSearch } = actions;
  const { search } = values;

  return (
    <div className={classes.searchPartners}>
      <div className={classes.searchPartnersTitle}>Partners</div>
      <div className={classes.searchPartnersInputContainer}>
        <FormControl fullWidth variant="outlined">
          <OutlinedInput
            className={classes.searchPartnersInput}
            id="outlined-adornment-amount"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon className={classes.searchPartnersInputIcon} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <CloseIcon className={classes.searchPartnersInputIcon} />
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
    </div>
  );
};

const SortPartnerTable = ({ actions, values }) => {
  const classes = useStyles();
  const { setSearch, setCategory, setRole } = actions;
  const { search, category, role } = values;

  return (
    <div>
      <SearchPartners actions={{ setSearch }} values={{ search }} />
      <Divider />
      <Grid container className={classes.sortPartners}>
        <div className={classes.sortPartnersCol1}>
          <ToggleButtonGroup
            value={category}
            exclusive
            size="small"
            onChange={(_event, value) => setCategory(value)}
            aria-label="filter by category"
          >
            <ToggleButton value="partners" aria-label="left aligned">
              My Partners
            </ToggleButton>
            <ToggleButton value="registry" aria-label="centered">
              Entire Registry
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className={classes.sortPartnersCol2}>
          <ToggleButtonGroup
            value={role}
            exclusive
            size="small"
            onChange={(_event, value) => setRole(value)}
            aria-label="filter by role"
          >
            <ToggleButton value={0} aria-label="left aligned">
              All Roles
            </ToggleButton>
            <ToggleButton value={1} aria-label="centered">
              Buyers
            </ToggleButton>
            <ToggleButton value={2} aria-label="centered">
              Suppliers
            </ToggleButton>
            <ToggleButton value={3} aria-label="centered">
              Carrier
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Grid>
      <Divider />
    </div>
  );
};

const PartnerCheckbox = ({ row, addPartner, isPartner, removePartner }) => {
  const onToggle = async event => {
    if (isPartner) {
      await removePartner({ variables: { input: { address: event.target.value } } });
    } else {
      await addPartner({ variables: { input: { address: event.target.value } } });
    }
  };

  return (
    <Checkbox
      checked={isPartner}
      onChange={onToggle}
      value={row.address}
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  );
};

const PartnerList = () => {
  const classes = useStyles();
  const { partners, organizations, addPartner, removePartner } = useContext(PartnerContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('registry');
  const [role, setRole] = useState(0);
  let items = category === 'registry' ? organizations : partners;

  // Filter by role
  if (role) {
    items = filter(items, { role }, []);
  }

  // Filter by search text
  if (search) {
    items = filter(items, item => {
      const lowercaseName = item.name.toLowerCase();
      return lowercaseName.indexOf(search.toLowerCase()) > -1;
    });
  }

  const notices = items;

  const columns = [
    {
      name: 'add',
      label: 'Add/Remove',
      formatter: (_value, { row }) => (
        <PartnerCheckbox
          addPartner={addPartner}
          removePartner={removePartner}
          isPartner={row.isPartner}
          row={row}
        />
      ),
    },
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'role',
      label: 'Role',
      formatter: value => {
        switch (value) {
          case 1:
            return 'Buyer';
          case 2:
            return 'Supplier';
          case 3:
            return 'Carrier';
          default:
            return 'Error';
        }
      },
    },
    {
      name: 'address',
      label: 'Address',
    },
  ];

  const companyCount = organizations.length;

  return (
    <NoticeLayout selected="partners">
      <SortPartnerTable
        actions={{ setSearch, setCategory, setRole }}
        values={{ search, category, role }}
      />
      <Typography variant="h2" className={classes.companyCount}>
        {companyCount} Companies
      </Typography>
      <Divider />
      <DataTable
        data={notices}
        columns={columns}
        options={{
          key: 'name',
        }}
      />
    </NoticeLayout>
  );
};

export default PartnerList;
