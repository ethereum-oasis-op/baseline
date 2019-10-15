import React, { useContext } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import MetaMaskContext from '../contexts/metamask-context';
import { UserContext } from '../contexts/user-context';
import CheckingRegistry from './MetaMask/CheckingRegistry';
import Error from './MetaMask/Error';
import Loading from './MetaMask/Loading';
import LoggedIn from './MetaMask/LoggedIn';
import LoggedOut from './MetaMask/LoggedOut';
import LogoutButton from './MetaMask/LogoutButton';
import NotInstalled from './MetaMask/NotInstalled';
import NotRegistered from './MetaMask/NotRegistered';
import NoWallet from './MetaMask/NoWallet';
import OpenAndAllow from './MetaMask/OpenAndAllow';

export default function LoginForm() {
  const { web3, accounts, error, awaiting, openMetaMask } = useContext(MetaMaskContext);
  const { userState, user } = useContext(UserContext);
  let contents;

  if (error && error.message === 'MetaMask not installed') {
    contents = <NotInstalled />;
  } else if (error) {
    contents = <Error>{error}</Error>;
  } else if (!web3 && awaiting) {
    contents = <Loading />;
  } else if (!web3) {
    contents = <OpenAndAllow openMetaMask={openMetaMask} />;
  } else if (accounts.length === 0) {
    contents = <NoWallet />;
  } else if (userState === 'validating') {
    contents = <CheckingRegistry />;
  } else if (userState === 'loggedOut') {
    contents = <LoggedOut />;
  } else if (userState === 'notRegistered') {
    contents = <NotRegistered />;
  } else {
    contents = <LoggedIn />;
  }

  return (
    <Card>
      <CardContent>{contents}</CardContent>
      {user ? (
        <CardActions>
          <LogoutButton />
        </CardActions>
      ) : null}
    </Card>
  );
}
