import { MerkleTreeService } from './merkleTree.service';
import MerkleTree from 'merkletreejs';

let merkleTreeService: MerkleTreeService;
let payload: any;
beforeAll(async () => {
  payload = {
    SupplierInvoiceID: 'INV123',
    Amount: 300,
    IssueDate: '2023-06-15',
    DueDate: '2023-07-15',
    Status: 'NEW',
    Items: [
      { id: 1, productId: 'product1', price: 100, amount: 1 },
      { id: 2, productId: 'product2', price: 200, amount: 1 },
    ],
  };
  merkleTreeService = new MerkleTreeService();
});

describe('MerkleTree Service', () => {
  it('Should merkelize raw json with arrays properly', async () => {
    // Arrange
    const expectedLeaves = [
      'SupplierInvoiceID',
      'INV123',
      'Amount',
      '300',
      'IssueDate',
      '2023-06-15',
      'DueDate',
      '2023-07-15',
      'Status',
      'NEW',
      'id',
      '1',
      'productId',
      'product1',
      'price',
      '100',
      'amount',
      '1',
      'id',
      '2',
      'productId',
      'product2',
      'price',
      '200',
      'amount',
      '1',
    ];

    // Act
    const merkelizedPayload = merkleTreeService.merkelizePayload(
      payload,
      'sha256',
    );

    const expectedPayload = merkleTreeService.formMerkleTree(
      expectedLeaves,
      'sha256',
    );

    // Assert
    expect(MerkleTree.marshalTree(expectedPayload)).toBe(
      MerkleTree.marshalTree(merkelizedPayload),
    );
  });
});
