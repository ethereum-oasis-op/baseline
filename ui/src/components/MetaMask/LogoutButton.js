import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import { UserContext } from '../../contexts/user-context';

const LogoutButton = () => {
  const { logout } = useContext(UserContext);

  return (
    <Button variant="outlined" onClick={() => logout()}>
      Logout
    </Button>
  );
};

export default LogoutButton;
