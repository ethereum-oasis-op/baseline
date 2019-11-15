const getOrganizationInfo = () => {
  return {
    balance: Math.round(Math.random() * 20),
    name: 'Org1',
    role: 'buyer',
  };
};

export default {
  getOrganizationInfo,
};
