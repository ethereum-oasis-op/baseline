import React from 'react';
import Container from '@material-ui/core/Container';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';

const Home = () => (
  <Layout>
    <Container fixed>
      <h1>Home</h1>
      <LoginForm />
    </Container>
  </Layout>
);

export default Home;
