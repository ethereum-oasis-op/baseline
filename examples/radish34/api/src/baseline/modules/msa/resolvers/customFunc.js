const customFunc = async (params, options) => {
  console.log('CUSTOM FUNC CALLED', params, options);
  return {
    customResponse: 'MSA Created',
  };
};

export default customFunc;
