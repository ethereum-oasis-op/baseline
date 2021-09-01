import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AppStateContext = React.createContext([{}, () => {}]);

const AppStateProvider = ({ children }) => {
  const [state, setState] = useState({
    // Placeholder
  });

  return <AppStateContext.Provider value={[state, setState]}>{children}</AppStateContext.Provider>;
};

AppStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AppStateContext, AppStateProvider };
