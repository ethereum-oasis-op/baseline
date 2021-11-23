import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import HalfColumn from '../components/HalfColumn';

const useStyles = makeStyles(() => ({
  image: {
    margin: '2rem',
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <Layout scroll={false}>
      <HalfColumn rightColumn={false}>
        <div>Homepage</div>
      </HalfColumn>

      <HalfColumn rightColumn>
        <div className={classes.image}>
          <h1>img placeholder</h1>
        </div>
      </HalfColumn>
    </Layout>
  );
};

export default Home;
