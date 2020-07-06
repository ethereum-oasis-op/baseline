using Unibright.Explorer.Transthereum.DTOs;

namespace Unibright.Explorer.Transthereum.Services
{
    public interface ITransactionParser
    {
        void ParseInputParameters(TransactionDto transDto, string input);
    }
}