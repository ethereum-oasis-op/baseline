using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Unibright.Explorer.Transthereum.Services;

namespace Unibright.Explorer.Transthereum.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExplorerController : ControllerBase
    {
        private readonly IBlockchainExplorer blockchainExplorer;
        public ExplorerController(IBlockchainExplorer nethereumService)
        {
            this.blockchainExplorer = nethereumService;
        }

        [HttpGet("blocks/{blockHeight}")]
        public async Task<ActionResult> GetBlock(long blockHeight)
        {
            var block = await this.blockchainExplorer.GetBlock(blockHeight);
            return Ok(block);
        }

        [HttpGet("blocks/latest5")]
        public async Task<ActionResult> GetLatestBlocks()
        {
            var blocks = await this.blockchainExplorer.GetLatestBlocks(5);
            return Ok(blocks);
        }

        [HttpGet("transactions/{transHash}")]
        public async Task<ActionResult> GetTransaction(string transHash)
        {
            var transaction = await this.blockchainExplorer.GetTransaction(transHash);
            return Ok(transaction);
        }

        [HttpGet("transactions/latest")]
        public async Task<ActionResult> GetLatestTransactions()
        {
            var transactions = await this.blockchainExplorer.GetLatestTransactions(5);
            return Ok(transactions);
        }

        [HttpGet("address/{address}")]
        public async Task<ActionResult> GetAddressWithBalancesAndTransactions(string address)
        {
            var enrichedAddress = await this.blockchainExplorer.GetAddressWithBalancesAndTransactions(address);
            return Ok(enrichedAddress);
        }
    }
}
