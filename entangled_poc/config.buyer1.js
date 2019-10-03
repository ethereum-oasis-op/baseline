const config = {
  name: 'Buyer1',
  mongoHost: 'mongo:27017',
  databaseName: 'buyer1db',
  entangledField: 'rfq-itemQty',
  entanglers: [
    {
      name: 'Supplier 1',
      address: '0x1231231'
    },
    {
      name: 'Supplier 2',
      address: '0x31232113'
    }
  ],
  rfqs: [
    { 
      id: '123',
      itemQty: 11
    }
  ]
};

module.exports = config;