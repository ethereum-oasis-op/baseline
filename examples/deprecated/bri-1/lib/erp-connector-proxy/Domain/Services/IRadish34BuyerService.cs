using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Unibright.Connector.Radish34proxy.Model;

namespace radishproxy.API.Domain.Services
{
    public interface IRadish34BuyerService
    {
        Task<StatusCodeResult> CreateRequestForProposalAsync(RequestForProposal requestForProposal, string senderJwt);
        Task<List<Proposal>> CheckForNewProposalsAsync(string senderJwt, Dictionary<string, object> args);
        Task<Proposal> GetProposalAsync(string proposalId, string senderJwt, Dictionary<string, object> args);
        Task<OkResult> CreatePurchaseOrderAsync(PurchaseOrder purchaseOrder, string senderJwt);


    }
}