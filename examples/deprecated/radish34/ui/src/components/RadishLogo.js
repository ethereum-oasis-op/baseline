import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  '@keyframes radish': {
    '0%': { transform: 'rotate(0)' },
    '66%, 100%': { transform: 'rotate(360deg)' },
  },
  radish: {
    animationName: '$radish',
    animationDuration: '3s',
    animationTimingFunction: 'ease-out',
    animationIterationCount: 'infinite',
    transformOrigin: '50% 50%',
    transformBox: 'fill-box',
  },
  '@keyframes rightLeaf': {
    '0%': { transform: 'translate(0)' },
    '33%': { transform: 'translate(40%, -15%)' },
    '66%, 100%': { transform: 'translate(0)' },
  },
  rightLeaf: {
    animationName: '$rightLeaf',
    animationDuration: '3s',
    animationTimingFunction: 'ease-out',
    animationIterationCount: 'infinite',
  },
  '@keyframes leftLeaf': {
    '0%': { transform: 'translate(0)' },
    '33%': { transform: 'translate(-40%, -15%)' },
    '66%, 100%': { transform: 'translate(0)' },
  },
  leftLeaf: {
    animationName: '$leftLeaf',
    animationDuration: '3s',
    animationTimingFunction: 'ease-out',
    animationIterationCount: 'infinite',
  },
  container: {
    overflow: 'visible',
    width: '1rem',
    height: '2rem',
  },
  loaderContainer: {
    overflow: 'visible',
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
}));

const RadishLogo = ({ width, height, loader }) => {
  const classes = useStyles();

  return (
    <svg
      className={loader ? classes.loaderContainer : classes.container}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={loader ? classes.leftLeaf : undefined}
        d="M29.4297 10.6092C30.4506 16.3844 27.139 21.7979 27.139 21.7979C27.139 21.7979 22.1722 17.8479 21.1513 12.0726C20.1303 6.29745 19.3027 1.61572 23.4419 0.884013C27.5811 0.152303 28.4088 4.83403 29.4297 10.6092Z"
        fill="#444F59"
      />
      <path
        className={loader ? classes.rightLeaf : undefined}
        d="M37.3961 12.9795C35.2211 18.426 29.5543 21.2825 29.5543 21.2825C29.5543 21.2825 27.4138 15.3084 29.5888 9.86184C31.7637 4.41529 33.5269 0 37.4305 1.55883C41.3341 3.11766 39.571 7.53295 37.3961 12.9795Z"
        fill="#606972"
      />
      <g className={loader ? classes.radish : undefined}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M34.3765 61.8953C36.4395 60.529 54 57.0744 54 42.1048C54 30.8165 42.2713 21.6655 27.8032 21.6655C13.3351 21.6655 1.60638 30.8165 1.60638 42.1048C1.60638 56.7866 19.4464 60.0617 21.8975 62.0226C24.3487 63.9835 28.0911 70.6047 28.0911 70.6047C28.0911 70.6047 32.3135 63.2617 34.3765 61.8953Z"
          fill="#444F59"
        />
        <rect y="38.9385" width="19.5757" height="3.45453" rx="1.72726" fill="white" />
        <rect x="2.75739" y="44.6982" width="12.0908" height="3.45453" rx="1.72726" fill="white" />
      </g>
    </svg>
  );
};

RadishLogo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  loader: PropTypes.bool,
};

RadishLogo.defaultProps = {
  width: 115,
  height: 215,
  loader: false,
};

export default RadishLogo;
