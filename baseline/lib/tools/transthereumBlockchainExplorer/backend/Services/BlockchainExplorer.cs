
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Nethereum.BlockchainProcessing.Processor;
using Nethereum.Hex.HexTypes;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Util;
using Nethereum.Web3;
using Unibright.Explorer.Transthereum.DTOs;

namespace Unibright.Explorer.Transthereum.Services
{
    public class BlockchainExplorer : IBlockchainExplorer
    {
        private readonly IConfiguration Configuration;
        private readonly Web3 web3;
        private readonly ITransactionParser transactionParser;

        public BlockchainExplorer(IConfiguration configuration, ITransactionParser transactionParser)
        {
            this.Configuration = configuration;
            this.web3 = new Web3(configuration["BlockchainURL"]);
            this.transactionParser = transactionParser;
        }

        public async Task<BlockDto> GetBlock(long blockHeight)
        {
            var b = await web3.Eth.Blocks.GetBlockWithTransactionsByNumber.SendRequestAsync(new HexBigInteger(blockHeight));

            if (b == null)
            {
                return null;
            }

            return MapBlockToDto(b);
        }

        public async Task<IEnumerable<BlockDto>> GetLatestBlocks(int numberOfBlocks)
        {
            var latestBlocks = await this.GetBlocksFromLatest(numberOfBlocks);
            return latestBlocks.Select(b => MapBlockToDto(b));
        }

        public async Task<TransactionDto> GetTransaction(string transHash)
        {
            var transaction = await web3.Eth.Transactions.GetTransactionByHash.SendRequestAsync(transHash);

            if (transaction == null)
            {
                return null;
            }

            var block = await web3.Eth.Blocks.GetBlockWithTransactionsByNumber.SendRequestAsync(transaction.BlockNumber);
            var receipt = await web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transaction.TransactionHash);

            var transDto = MapTransactionToDto(transaction, block, receipt);
            transactionParser.ParseInputParameters(transDto, transaction.Input);

            return transDto;
        }

        public async Task<IEnumerable<TransactionDto>> GetLatestTransactions(int numberOfBlocks)
        {
            var latestBlocks = await this.GetBlocksFromLatest(numberOfBlocks);
            var latestTransactions = new List<TransactionDto>();

            foreach (var b in latestBlocks)
            {
                latestTransactions.AddRange(b.Transactions.Select(t => MapTransactionToDto(t, b, null)));
            };

            return latestTransactions;
        }

        public async Task<AddressDto> GetAddressWithBalancesAndTransactions(string address)
        {
            if (!IsValidAddress(address))
            {
                return null;
            }

            var enrichedAddress = new AddressDto { Address = address, Balances = new List<TokenBalanceDto>() };

            await GetTokenBalancesForAddress(enrichedAddress);

            await GetTransactionsForAddress(enrichedAddress);

            return enrichedAddress;
        }

        private async Task<IEnumerable<BlockWithTransactions>> GetBlocksFromLatest(int numberOfBlocks)
        {
            var blocks = new List<BlockWithTransactions>();
            var latestBlockNumber = await web3.Eth.Blocks.GetBlockNumber.SendRequestAsync();

            for (int i = 0; i < numberOfBlocks; i++)
            {
                var blockNumber = latestBlockNumber.Value - i;

                if (blockNumber < 0)
                {
                    return blocks;
                }

                var block = await web3.Eth.Blocks.GetBlockWithTransactionsByNumber.SendRequestAsync(new HexBigInteger(blockNumber));
                if (block != null)
                {
                    blocks.Add(block);
                }
            }

            return blocks;
        }

        private bool IsValidAddress(string address)
        {
            var addressUtil = new AddressUtil();

            if (addressUtil.IsAnEmptyAddress(address) ||
                    !addressUtil.IsValidAddressLength(address) ||
                        !addressUtil.IsValidEthereumAddressHexFormat(address))
            {
                return false;
            }

            return true;
        }

        private async Task GetTokenBalancesForAddress(AddressDto enrichedAddress)
        {
            var tokenContractsToCheck = this.Configuration.GetSection("Tokens").Get<TokenBalanceDto[]>();

            var balanceOfFunctionMessage = new BalanceOfFunction { Owner = enrichedAddress.Address };

            var balanceHandler = web3.Eth.GetContractQueryHandler<BalanceOfFunction>();

            foreach (var tokenContract in tokenContractsToCheck)
            {
                var amount = await balanceHandler.QueryAsync<BigInteger>(tokenContract.Address, balanceOfFunctionMessage);
                tokenContract.Amount = amount.ToString();
                enrichedAddress.Balances.Add(tokenContract);
            }
        }

        private async Task GetTransactionsForAddress(AddressDto enrichedAddress)
        {
            var latestBlockNumber = await web3.Eth.Blocks.GetBlockNumber.SendRequestAsync();
            uint minimumBlockConfirmations = 0;
            var receipts = new List<TransactionReceiptVO>();

            var processor = web3.Processing.Blocks.CreateBlockProcessor(steps =>
            {
                steps.TransactionStep.SetMatchCriteria(t => t.Transaction.IsFrom(enrichedAddress.Address) || t.Transaction.IsTo(enrichedAddress.Address));
                steps.TransactionReceiptStep.AddSynchronousProcessorHandler(tx =>
                receipts.Add(tx)
                );
            }, minimumBlockConfirmations);

            var toBlock = new BigInteger(latestBlockNumber);
            var fromBlock = latestBlockNumber.Value - 5;

            await processor.ExecuteAsync(toBlockNumber: toBlock);

            enrichedAddress.Transactions = receipts
                .Select(r => MapReceiptToTransactionDto(r))
                .OrderByDescending(t => t.BlockHeight)
                .ToList();
        }

        private BlockDto MapBlockToDto(BlockWithTransactions b)
        {
            return new BlockDto
            {
                BlockHeight = (long)b.Number.Value,
                BlockHash = b.BlockHash,
                TimeStamp = b.Timestamp.ToString(),
                TransactionCount = b.TransactionCount()
            };
        }

        private TransactionDto MapTransactionToDto(Transaction t, BlockWithTransactions b, TransactionReceipt r)
        {
            return new TransactionDto
            {
                BlockHeight = (long)t.BlockNumber.Value,
                From = t.From,
                To = t.To,
                Quantity = t.Value.Value.ToString(),
                Status = r != null ? r.Status.ToString() : "",
                TimeStamp = b.Timestamp.ToString(),
                TransactionHash = t.TransactionHash
            };
        }

        private TransactionDto MapReceiptToTransactionDto(TransactionReceiptVO r)
        {
            return new TransactionDto
            {
                BlockHeight = (long)r.Transaction.BlockNumber.Value,
                From = r.Transaction.From,
                To = r.Transaction.To,
                Quantity = r.Transaction.Value.Value.ToString(),
                Status = r.Failed ? "0" : "1",
                TimeStamp = r.Block.Timestamp.ToString(),
                TransactionHash = r.TransactionHash
            };
        }
    }
}