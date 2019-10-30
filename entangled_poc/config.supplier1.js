const config = {
  name: 'Supplier 1',
  mongoHost: 'mongo:27017',
  databaseName: 'supplier1db',
  entangledField: 'rfq-itemQty',
  entanglers: [
    {
      name: 'Buyer 1',
      address: '0x1231231'
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