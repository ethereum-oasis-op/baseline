import React, { useContext } from 'react';
import { UserContext } from '../../contexts/user-context';

const LoggedOut = () => {
  const { login } = useContext(UserContext);

  return (
    <div>
      You Logged out{' '}
      <button type="button" onClick={login}>
        Login
      </button>
    </div>
  );
};

export default LoggedOut;
