import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import Layout from './Layout';
import Sidebar from './Sidebar';
import PageWrapper from './PageWrapper';
import SideNav from './SideNav';
import { NoticeContext } from '../contexts/notice-context';

const NoticeLayout = ({ selected, children }) => {
  const { notices } = useContext(NoticeContext);

  return (
    <Layout>
      <Sidebar>
        <SideNav notices={notices} selected={selected} />
      </Sidebar>
      <PageWrapper>{children}</PageWrapper>
    </Layout>
  );
};

NoticeLayout.propTypes = {
  selected: PropTypes.string,
  children: PropTypes.node.isRequired,
};

NoticeLayout.defaultProps = {
  selected: '',
};

export default NoticeLayout;
