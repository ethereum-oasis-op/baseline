namespace Unibright.Explorer.Transthereum.DTOs
{
    public class TradeDto
    {
        public string From { get; set; }

        public string To { get; set; }

        public string Direction { get; set; }

        public TokenBalanceDto StableToken { get; set; }

        public TokenBalanceDto AssetToken { get; set; }

        public decimal Price { get; set; }
    }
}