import metamaskLogo from './logo.metamask.svg';
import radishLogo from './logo.radish.svg';

const primary = {
  lightest: '#F6F6FA',
  lighter: '#C4C4CD',
  light: '#747480',
  main: '#2e2e38',
  dark: '#000000',
  blue: '#007BFF',
  red: '#C1091B',
};

const secondary = {
  lightest: '#fffde7',
  lighter: '#fff59d',
  light: '#E4E8EA',
  main: '#144361',
  dark: '#ffbf00',
};

const client = {
  lightest: '#36b3b5',
  lighter: '#e3e3e3',
  light: '#3e8c8c',
  main: '#395757',
  dark: '#596364',
  background: '#d1d1d1',
  blueGray: '#E4E8EA',
  title: '#607077',
  white: '#f1f1f1',
};

const breakpoints = {
  values: {
    xl: 1920,
    lg: 1170,
    md: 960,
    sm: 600,
    xs: 0,
  },
};

const typography = {
  fontFamily: 'Lato',
  useNextVariants: true,
};

export default {
  palette: { primary, secondary, client },
  breakpoints,
  overrides: {
    MuiInput: {
      underline: {
        color: '#007BFF',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        fontWeight: 'bold',
      },
    },
    MuiCard: {
      root: {
        backgroundColor: 'transparent',
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: 'none',
      },
    },
    MuiDrawer: {
      paper: {
        width: '25rem',
      },
    },
    MuiListItemIcon: {
      root: {
        color: '#212B34',
        minWidth: '2.1rem',
        fontSize: 'smaller',
      },
    },
    MuiSvgIcon: {
      root: {
        width: '.7em',
        height: 'auto',
      },
    },
    MuiTypography: {
      h2: {
        fontSize: '1.333rem',
        fontWeight: 'normal',
        color: '#000000',
        padding: '1rem 0',
        fontFamily: 'Lato',
      },
      h3: {
        fontSize: '1rem',
        color: '#000000',
        fontWeight: 'bold',
      },
      h4: {
        fontSize: '2rem',
        fontWeight: 'bold',
        lineHeight: '2.5',
      },
      h5: {
        fontSize: '1.1rem',
        color: '#fff',
        fontWeight: '500',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 'normal',
        color: '#fff',
      },
      subtitle2: {
        fontSize: '.9rem',
        fontWeight: 'normal',
        color: '#fff',
      },
      body1: {
        fontSize: '.9rem',
        lineHeight: '1.5',
      },
    },
  },
  typography,
  metamaskLogo,
  radishLogo,
};
