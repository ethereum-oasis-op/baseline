import React, { useState, useEffect, useCallback } from 'react';
import gql from 'graphql-tag';
import get from 'lodash/get';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useMetaMask } from './metamask-context';

export const UserContext = React.createContext();

const GET_ORGANIZATION_QUERY = gql`
  query GetOrganization($address: Address!) {
    organization(address: $address) {
      name
      address
      role
    }
  }
`;

const REGISTER_ORGANIZATION = gql`
  mutation RegisterOrganization($input: RegisterOrganization!) {
    registerOrganization(input: $input) {
      organization {
        name
        address
        role
      }
    }
  }
`;

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
  const [register, { data: newProfile }] = useMutation(REGISTER_ORGANIZATION);
  const [checkRegistry, { data: existingProfile }] = useLazyQuery(GET_ORGANIZATION_QUERY);

  console.log('USERPROVIDER', {
    user,
    userState,
    newProfile,
    existingProfile,
    accounts,
  });

  const logout = () => {
    logoutUser();
    window.location.reload();
  };

  const loadProfile = profile => {
    setUser(profile);
    storeUser(profile);
    setUserState('loggedIn');
  };

  // Current account is already registered
  useEffect(() => {
    const profile = get(existingProfile, 'organization');
    if (profile) {
      loadProfile(profile);
    } else if (accounts[0]) {
      setUserState('notRegistered');
    }
  }, [existingProfile, accounts]);

  // Current account has just been registered
  useEffect(() => {
    const profile = get(newProfile, 'registerOrganization.organization');
    if (profile) {
      loadProfile(profile);
    }
  }, [newProfile]);

  // Update login function if accounts change
  const login = useCallback(() => {
    setUserState('validating');
    console.log('NEW THING', { address: accounts[0] });

    checkRegistry({ variables: { address: accounts[0] } });
  }, [accounts, checkRegistry]);

  // If the user switches accounts, re-attempt a login
  useEffect(() => {
    logoutUser();
    setUser(null);
    if (accounts[0]) {
      login();
    }
  }, [accounts, login]);

  return <UserContext.Provider value={{ userState, user, logout, login, register }} {...props} />;
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`);
  }
  return context;
};
