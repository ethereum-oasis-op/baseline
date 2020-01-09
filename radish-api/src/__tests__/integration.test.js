const request = require('supertest');
partnerApiURL = "";
//assume it would be in the app.js


/**Writing a basic test retrieving a partner**/

describe('Partner graphq testing', () => {

let partnerAddress;

test('Partner graphql query if entry exists for partner address returns 200', async () => {
    const queryBody = `{ partner(address: "${partnerAddress}") { name, address } } `
    const res = await request(partnerApiURL)
      .post('/graphql')
      //Still doing a post?
      .send({ query: queryBody });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.partner.address).toEqual(partnerAddress);
    expect(res.body.data.partner.name).toEqual(name);
  });

});

//Next step test it with Node.js