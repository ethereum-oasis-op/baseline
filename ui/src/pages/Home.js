import React from 'react';
import Container from '@material-ui/core/Container';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';

const style = {
  marginBottom: '3rem',
  border: '1px solid silver',
  padding: '2rem',
}

const Home = () => (
  <Layout>
    <Container fixed>
      <h1>Home</h1>
      <LoginForm />
    </Container>
  </Layout>
);

export default Home;
