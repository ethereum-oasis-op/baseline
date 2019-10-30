const config = {
  name: 'Buyer1 Demo',
  mongoHost: 'mongo:27017',
  databaseName: 'buyer1db',
  entangledField: 'rfq-itemQty',
  entanglers: [
    {
      _id: '111',
      name: 'Supplier 1',
      address: '0x1231231'
    },
    {
      _id: '222',
      name: 'Supplier 2',
      address: '0x31232113'
    }
  ]
};

module.exports = config;
