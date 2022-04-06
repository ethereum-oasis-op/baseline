using System.Collections.Generic;
using radishproxy.API.Domain.Model;
using radishproxy.API.Domain.Repositories;
using Unibright.Connector.Radish34proxy.Model;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System;
using Microsoft.Extensions.Logging;

namespace radishproxy.API.Repositories
{
    public class Radish34Repository : IRadish34Repository
    {

        //In-memory Collection for Participants
        private readonly List<Participant> _participants;

        //In-memory Collection for Agreements
        private readonly Dictionary<string, Agreement> _agreements;

        private readonly ILogger<Radish34Repository> _logger;

        public Radish34Repository(ILogger<Radish34Repository> logger)
        {
            _logger = logger;

            //This ID mapping should be established prior to the integration case
            //This is a mockup version for the scope of the demo
            _participants = new List<Participant>()
            {
                new Participant()
                {
                    ParticipantId = "SAP Unibright",
                    Emails = new List<string>(){"<mail@buyer[.]com>"},
                    ProcessRole = ProcessRoles.Buyer.ToString(),
                    Address = "<0x4xxxxx>",
                    ProvideJWT = "<Provide-issued JWT with organization subject claim>",
                    Partners = new List<Partner>()
                    {
                        new Partner()
                        {
                            PartnerParticipantId = "D365 Envision",
                            Description = "Envision Supplier",
                            ProcessRole = ProcessRoles.Supplier.ToString(),
                            IdMapping = new Dictionary<string, string>()
                            {
                                {"US-017","0000004444"},
                                {"0000004444","US-017"}
                            },
                            SkuMapping = new Dictionary<string, string>()
                            {
                                {"D005","100-100"},
                                {"D006","400-400"},
                                {"100-100","D005"},
                                {"400-400","D006"}
                            }
                        }
                    }
                },
                new Participant()
                {
                    ParticipantId = "D365 Envision",
                    Emails = new List<string>(){"<mail@supplier[.]com>"},
                    ProcessRole = ProcessRoles.Supplier.ToString(),
                    Address = "<0x96Cxxx>",
                    ProvideJWT = "<Provide-issued JWT with organization subject claim>",
                    Partners = new List<Partner>()
                    {
                        new Partner()
                        {
                            PartnerParticipantId = "SAP Unibright",
                            Description = "Unibright Supplier",
                            ProcessRole = ProcessRoles.Buyer.ToString(),
                            IdMapping = new Dictionary<string, string>()
                            {
                                {"US-017","0000004444"},
                                {"0000004444","US-017"}
                            },
                            SkuMapping = new Dictionary<string, string>()
                            {
                                {"D005","100-100"},
                                {"D006","400-400"},
                                {"100-100","D005"},
                                {"400-400","D006"}
                            }
                        }
                    }
                }
            };
            _agreements = new Dictionary<string, Agreement>();

        }
        public Participant GetParticipantFromRequest(IHeaderDictionary headers)
        {
            return _participants.FirstOrDefault(p => p.ProvideJWT == GetJwtFromRequest(headers));
        }

        public string GetJwtFromRequest(IHeaderDictionary header)
        {
            string jwt = "";
            var auth = header.FirstOrDefault(x => x.Key == "Authorization" || x.Key == "authorization").Value.FirstOrDefault();
            var bearer = auth.Split("Bearer").ToList();
            jwt = bearer.Last().Trim();
            
            return jwt;
        }

        public void UpdateParticipants(string email, string JwtToken)
        {
            var participant = _participants.FirstOrDefault(p => p.Emails.Contains(email));
            if (participant != null)
                participant.ProvideJWT = JwtToken;
        }

        public List<string> GetRecipientAddresses(Agreement agreement, string senderJwt)
        {
            List<string> recipientAddresses = new List<string>();
            try
            {
                string internalId = agreement.GetRecipientId();
                var sender = _participants.FirstOrDefault(p => p.ProvideJWT == senderJwt);
                if (sender != null)
                {
                    var partner = sender.Partners.FirstOrDefault(p => p.IdMapping.ContainsKey(internalId));
                    if (partner != null)
                    {
                        var recipient = _participants.FirstOrDefault(p => p.ParticipantId == partner.PartnerParticipantId);
                        if (recipient != null)
                            recipientAddresses.Add(recipient.Address);
                        else
                            _logger.LogError("recipient not found for participant {0}", partner.PartnerParticipantId);
                    }
                    else
                    {
                        _logger.LogError("partner not found for id {0}", internalId);
                    }
                }
                else
                {
                    _logger.LogError("sender not found for JWT {0}", senderJwt);
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Unexpected error in GetRecipientAddress");
            }


            return recipientAddresses;
        }

        public void StoreAgreement(Agreement agreement)
        {
            if (!String.IsNullOrEmpty(agreement.AgreementId))
                _agreements[agreement.AgreementId] = agreement;
        }

        public string GetReferencedBaselineId(Agreement agreement)
        {
            string ret = "";
            try
            {
                //based on the type of the agreement, we get the referenced Agreement

                if (agreement.GetType() == typeof(Proposal))
                {
                    var proposal = agreement as Proposal;

                    //Get request for Proposal
                    var rfps = _agreements.Where(a => a.Value.GetType() == typeof(RequestForProposal)).Select(a => a.Value as RequestForProposal).ToList();
                    var rfp = rfps.FirstOrDefault(r => r.RequestForProposalId == proposal.ReferencedRfpId && r.BuyerId == proposal.BuyerId);
                    if (rfp != null)
                        ret = rfp.AgreementId;
                }
                else if (agreement.GetType() == typeof(PurchaseOrder))
                {
                    var purchaseOrder = agreement as PurchaseOrder;

                    //Get Proposals
                    var proposals = _agreements.Where(a => a.Value.GetType() == typeof(Proposal)).Select(a => a.Value as Proposal).ToList();
                    var proposal = proposals.FirstOrDefault(p => p.ProposalId == purchaseOrder.ReferencedProposalId && p.SupplierId == purchaseOrder.SupplierId);
                    if (proposal != null)
                        ret = proposal.AgreementId;
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Unexpected Error in GetReferencedBaselineId");
            }

            return ret;
        }
    }
}
