import { Ident } from 'provide-js';

export const promisedTimeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const authenticateUser = async (email, password) => {
  const auth = await Ident.authenticate({
    email: email,
    password: password,
  }, 'http', 'localhost:8085');
  return auth;
};

export const createUser = async (firstName, lastName, email, password) => {
  const user = await Ident.createUser({
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  }, 'http', 'localhost:8085');
  return user;
};

export const createOrgToken = async (token, organizationId) => {
  return await Ident.clientFactory(token, 'http', 'localhost:8085').createToken({
    organization_id: organizationId,
  });
};
