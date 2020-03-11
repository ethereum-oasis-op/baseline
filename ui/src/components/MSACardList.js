import React from 'react';
import Grid from '@material-ui/core/Grid';
import uniqid from 'uniqid';
import MSACard from './MSACard';
import { calculateTieringPrice } from '../utils';

const MSACardList = ({ msas, volume, onClick, selectedMSA }) => (
  <Grid container style={{ margin: '2rem 0 2rem 0' }}>
    {msas.map(msa =>
      <Grid key={uniqid()} item xs={4}>
        <MSACard
          msa={msa}
          price={
            calculateTieringPrice(
              msa.tierBounds,
              msa.pricesByTier,
              msa.commitments[msa.commitments.length - 1].variables.accumulatedVolumeOrdered,
              Number(volume),
            )
          }
          volume={volume}
          onClick={() => onClick(msa)}
          selected={msa._id === selectedMSA}
        />
      </Grid>
    )
  }
  </Grid>
);

export default MSACardList;
