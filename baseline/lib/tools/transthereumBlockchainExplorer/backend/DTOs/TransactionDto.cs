using System.Collections.Generic;

namespace Unibright.Explorer.Transthereum.DTOs
{
    public class TransactionDto
    {
        public string TransactionHash { get; set; }

        public string From { get; set; }

        public string To { get; set; }

        public string Quantity { get; set; }

        public long BlockHeight { get; set; }

        public string TimeStamp { get; set; }

        public string Status { get; set; }

        public Dictionary<string, object> InputParameters { get; set; } = new Dictionary<string, object>();
    }
}