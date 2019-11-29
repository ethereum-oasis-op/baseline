import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import PageWrapper from '../components/PageWrapper';
import SideNav from '../components/SideNav';
import { MessageProvider } from '../contexts/message-context';
import MessagesTable from '../components/MessagesTable';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  list: {
    background: '#f3f6f8',
  },
  link: {
    textDecoration: 'none',
    display: 'block',
  },
  selected: {
    background: '#dee3e7',
  },
  contents: {
    padding: '0 1rem',
  },
  silver: {
    background: 'silver',
  },
  red: {
    background: 'red',
  },
  bold: {
    fontWeight: 'bold',
  },
  row: {
    background: 'rgba(242,245,245,0.8)',
  },
  new: {
    background: 'white',
  },
  categoryColumn: {
    width: '210px',
  },
  subjectColumn: {
    // width: '400px',
  },
  partnerColumn: {
    width: '200px',
  },
  lastModifiedColumn: {
    width: '200px',
  },
}));

const navItems = [
  {
    url: '/blah',
    label: 'Blah',
  },
];

const chipStyles = makeStyles(() => ({
  default: {
    borderColor: 'black',
  },
  msa: {
    borderColor: 'red',
  },
  procurementRequest: {
    borderColor: 'green',
  },
  invoice: {
    borderColor: 'blue',
  },
  rfq: {
    borderColor: 'lime',
  },
  purchaseOrder: {
    borderColor: 'orange',
  },
}));

const ChipMaker = ({ value, row }) => {
  const classes = chipStyles();

  const labels = {
    msa: 'MSA',
    procurementRequest: 'PRO',
    invoice: 'INV',
    rfq: 'RFQ',
    purchaseOrder: 'PO',
  };

  return (
    <Chip
      variant="outline"
      size="small"
      className={classes[value]}
      label={`${labels[value]}: ${row.status}`}
    />
  );
};

ChipMaker.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
    PropTypes.element,
  ]).isRequired,
  row: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const MessagesList = () => {
  const classes = useStyles();

  const columns = [
    {
      name: 'category',
      label: 'Category',
      component: ChipMaker,
      headerCellClasses: {
        [classes.categoryColumn]: true,
      },
      cellClasses: {
        [classes.bold]: (value, { row }) => row.new,
      },
    },
    {
      name: 'from',
      label: 'From',
      headerCellClasses: {
        [classes.partnerColumn]: true,
      },
      cellClasses: {
        [classes.bold]: (value, { row }) => row.new,
      },
    },
    {
      name: 'subject',
      label: 'Subject',
      headerCellClasses: {
        [classes.subjectColumn]: true,
      },
      cellClasses: {
        [classes.bold]: (value, { row }) => row.new,
      },
    },
    {
      name: 'lastModified',
      label: 'Last Modified',
      align: 'right',
      headerCellClasses: {
        [classes.lastModifiedColumn]: true,
      },
      cellClasses: {
        [classes.bold]: (value, { row }) => row.new,
      },
    },
  ];

  const options = {
    key: '_id',
    rowClasses: {
      [classes.row]: true,
      [classes.new]: (value, { row }) => row.new,
    },
  };

  return (
    <MessageProvider>
      <Layout>
        <Sidebar>
          <SideNav filters={navItems} />
        </Sidebar>
        <PageWrapper>
          <MessagesTable columns={columns} options={options} />
        </PageWrapper>
      </Layout>
    </MessageProvider>
  );
};

export default MessagesList;
