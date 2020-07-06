using System.IO;
using System.Linq;
using System.Numerics;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Nethereum.Web3;
using Unibright.Explorer.Transthereum.DTOs;

namespace Unibright.Explorer.Transthereum.Services
{
    public class TransactionParser : ITransactionParser
    {
        private readonly IConfiguration Configuration;
        private readonly Web3 web3;

        public TransactionParser(IConfiguration configuration)
        {
            this.Configuration = configuration;
            this.web3 = new Web3(configuration["BlockchainURL"]);
        }
    
        public void ParseInputParameters(TransactionDto transDto, string input)
        {
            var exchangeAddress = this.Configuration["ExchangeContractAddress"];

            if (string.Equals(transDto.To, exchangeAddress))
            {      
                string abi = this.GetInputFile(this.Configuration["AbiFilename"]);
                var contract = web3.Eth.GetContract(abi, exchangeAddress);
                var tradeFunction = contract.GetFunction("trade");
                var inputs = tradeFunction.DecodeInput(input);

                var from = inputs[0].Result.ToString();
                var marketId = inputs[1].Result.ToString();
                var assetTokenAmount = inputs[2].Result.ToString();
                var stableTokenAmount = inputs[3].Result.ToString();
                var price = inputs[4].Result.ToString();
                var isSellOrder = inputs[5].Result.ToString();

                var tokenContractsToCheck = this.Configuration.GetSection("Tokens").Get<TokenBalanceDto[]>();

                var assetToken = tokenContractsToCheck.First(t => t.MarketId == marketId);
                var stableToken = tokenContractsToCheck.First(t => string.IsNullOrEmpty(t.MarketId));

                assetToken.Amount = assetTokenAmount;
                stableToken.Amount = stableTokenAmount;

                transDto.InputParameters.Add("from", from.ToString());
                transDto.InputParameters.Add("to", assetToken.TraderContractAddress);
                transDto.InputParameters.Add("assetToken", assetToken);
                transDto.InputParameters.Add("stableToken", stableToken);
                transDto.InputParameters.Add("price", (decimal) BigInteger.Parse(price));
                transDto.InputParameters.Add("direction", isSellOrder == "True" ? "Sell" : "Buy");
            }
        }

        private string GetInputFile(string filename)
        {
            var embeddedProvider = new EmbeddedFileProvider(Assembly.GetExecutingAssembly());
            var stream = embeddedProvider.GetFileInfo(filename).CreateReadStream();
            using (StreamReader reader = new StreamReader(stream))
            {
                return reader.ReadToEnd();
            }
        }
    }
}