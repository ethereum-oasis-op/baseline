import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSubscription } from '@apollo/react-hooks';
import { INCOMING_TOASTR_NOTIFICATION } from '../graphql/toastr-notifications';
import Toastr from '../components/Toastr';

const ToastrContext = React.createContext([]);

const ToastrProvider = ({ children }) => {
  const userAddress =
    localStorage.getItem('userAddress');
  const { data } = useSubscription(INCOMING_TOASTR_NOTIFICATION, {
    variables: {
      userAddress,
    },
  });

  const [toastrOpen, showToastr] = useState(false);
  const [toastr, setToastr] = useState({});

  const displayToastr = (message, variant, horizontal = 'right', vertical = 'bottom') => {
    showToastr(true);
    setToastr({
      message,
      variant,
      anchorOrigin: {
        vertical,
        horizontal,
      },
    });
  };

  useEffect(() => {
    if (data && data.onNotification) {
      setToastr({});
      const { message, success } = data.onNotification;
      displayToastr(message, success ? 'success' : 'error');
    }
  }, [data]);

  const onClose = () => {
    showToastr(false);
  };

  return (
    <ToastrContext.Provider
      value={{
        displayToastr,
      }}
    >
      {toastrOpen && (
        <Toastr
          open={toastrOpen}
          variant={toastr.variant}
          message={toastr.message}
          anchorOrigin={toastr.anchorOrigin}
          onClose={onClose}
        />
      )}
      {children}
    </ToastrContext.Provider>
  );
};

ToastrProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ToastrContext, ToastrProvider };
