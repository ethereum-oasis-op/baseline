const errors = ({ dispatch }) => next => action => {
  // if an API GET request resulted in a 401, automatically log the user out
  // because it appears as though they are unauthenticated.
  if (
    action.error === true &&
    action.payload.name === 'ApiError' &&
    action.payload.status === 401
  ) {
    dispatch();
  }

  next(action);
};

export default errors;
