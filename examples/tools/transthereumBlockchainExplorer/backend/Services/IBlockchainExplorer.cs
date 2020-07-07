using System.Collections.Generic;
using System.Threading.Tasks;
using Unibright.Explorer.Transthereum.DTOs;

namespace Unibright.Explorer.Transthereum.Services
{
    public interface IBlockchainExplorer
    {
        Task<BlockDto> GetBlock(long blockHeight);

        Task<IEnumerable<BlockDto>> GetLatestBlocks(int numberOfBlocks);

        Task<TransactionDto> GetTransaction(string transHash);

        Task<IEnumerable<TransactionDto>> GetLatestTransactions(int numberOfBlocks);

        Task<AddressDto> GetAddressWithBalancesAndTransactions(string address);
    }
}