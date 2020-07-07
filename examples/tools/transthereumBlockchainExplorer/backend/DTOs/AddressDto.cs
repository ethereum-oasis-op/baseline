using System.Collections.Generic;

namespace Unibright.Explorer.Transthereum.DTOs
{
    public class AddressDto
    {
        public string Address { get; set; }

        public List<TokenBalanceDto> Balances { get; set; }

        public List<TransactionDto> Transactions { get; set; }
    }
}