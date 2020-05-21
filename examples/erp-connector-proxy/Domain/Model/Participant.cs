using System.Collections.Generic;

namespace radishproxy.API.Domain.Model
{
    public class Participant
    {
        public string ParticipantId { get; set; }
        public List<string> Emails { get; set; } = new List<string>();
        public string ProcessRole { get; set; }
        public string Address { get; set; }
        public string ProvideJWT { get; set; }

        public List<Partner> Partners { get; set; } = new List<Partner>();
    }

    public class Partner
    {
        public string PartnerParticipantId { get; set; }
        public string ProcessRole { get; set; }
        public string Description { get; set; }
        public Dictionary<string, string> SkuMapping { get; set; } = new Dictionary<string, string>();
        public Dictionary<string, string> IdMapping { get; set; } = new Dictionary<string, string>();

    }

    public enum ProcessRoles
    {
        Buyer,
        Supplier
    }
}