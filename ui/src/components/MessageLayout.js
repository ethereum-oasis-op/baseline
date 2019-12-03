import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import Layout from './Layout';
import Sidebar from './Sidebar';
import PageWrapper from './PageWrapper';
import SideNav from './SideNav';
import { MessageContext } from '../contexts/message-context';

const MessageLayout = ({ selected, children }) => {
  const { messages } = useContext(MessageContext);

  return (
    <Layout>
      <Sidebar>
        <SideNav messages={messages} selected={selected} />
      </Sidebar>
      <PageWrapper>{children}</PageWrapper>
    </Layout>
  );
};

MessageLayout.propTypes = {
  selected: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default MessageLayout;
