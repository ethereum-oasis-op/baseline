namespace Unibright.Explorer.Transthereum.DTOs
{
    public class BlockDto
    {
        public long BlockHeight { get; set; }

        public string TimeStamp { get; set; }

        public string BlockHash { get; set; }

        public int TransactionCount { get; set; }
    }
}