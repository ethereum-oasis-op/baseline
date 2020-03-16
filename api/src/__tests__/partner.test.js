const request = require('supertest');

const apiURL = 'http://localhost:8001';

describe('Partner graphq testing', () => {
  let partnerAddress;

  test('Partner graphql mutation addPartner() returns 200', async () => {
    const postBody = ` mutation {
      addPartner (input: {
                    name: "FakeName",
                    address: "0x0D8c04aCd7c417D412fe4c4dbB713f842dcd3A65",
                    role: "buyer",
                    identity: "0x04add8b0efbd90e40303b8822a8086ba8bfb263374abaa0c0336115c9769f82b4148631bcb23d3634bcb7db994e2f3ee9a2bba107e56619856f39d57d869da94e2"
      })   
        { address }
      } `;
    const res = await request(apiURL)
      .post('/graphql')
      .send({ query: postBody });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.addPartner.address).toEqual('0x0D8c04aCd7c417D412fe4c4dbB713f842dcd3A65');
    partnerAddress = '0x0D8c04aCd7c417D412fe4c4dbB713f842dcd3A65';
  });

  test('Partner graphql query if entry exists for partner address returns 200', async () => {
    const queryBody = `{ partner(address: "${partnerAddress}") { address, name } } `;
    const res = await request(apiURL)
      .post('/graphql')
      .send({ query: queryBody });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.partner.address).toEqual(partnerAddress);
  });
});

/* For this test to work: 

1) Change addPartner mutation in partner.js resolver file to:
 
addPartner: async (_parent, args) => {
      await savePartner(args.input);
      const partner = await getPartnerByAddress(args.input.address);
      return partner;
    }

2) Change every collection('partner') in partner.js services file to: 

collection('organization')

*/
