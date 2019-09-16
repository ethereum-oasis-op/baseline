import React, { useState, useEffect, useCallback } from 'react';
import { useMetaMask } from './metamask-context';

export const UserContext = React.createContext();

const checkRegistry = async address => {
  // Simulates a call to the API or Web3 to see if the contract contains a user with this address
  if (address === '0xc1b8662A68F3eb66bC5e5C4DE7C1EF04Dc344d53') {
    const accepted = await new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            role: 'Buyer',
            name: 'Buyer1',
            address,
          }),
        1000,
      ),
    );
    return accepted;
  }
  const rejected = await new Promise(resolve => setTimeout(() => resolve(null), 1000));
  return rejected;
};

const storeUser = user => window.localStorage.setItem('user', JSON.stringify(user));
const logoutUser = () => window.localStorage.removeItem('user');

export const loadUser = () => {
  const user = window.localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const UserProvider = props => {
  const { accounts } = useMetaMask();
  const [user, setUser] = useState(loadUser);
  const [userState, setUserState] = useState('loading');
  const account = accounts[0];

  const update = profile => {
    if (profile) {
      setUser(profile);
      storeUser(profile);
      setUserState('loggedIn');
    } else {
      setUser(null);
      storeUser(null);
      setUserState('notRegistered');
    }
  };

  const login = useCallback(() => {
    checkRegistry(accounts[0]).then(update);
    setUserState('validating');
  }, [accounts]);

  const logout = () => {
    logoutUser();
    setUser(null);
    setUserState('loggedOut');
  };

  useEffect(() => {
    if (account) {
      login();
    }
  }, [account, login]);

  return <UserContext.Provider value={{ userState, user, logout, login }} {...props} />;
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`);
  }
  return context;
};
