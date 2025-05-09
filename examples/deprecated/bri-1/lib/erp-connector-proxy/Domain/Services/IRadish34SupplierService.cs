using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Unibright.Connector.Radish34proxy.Model;

namespace radishproxy.API.Domain.Services
{
    public interface IRadish34SupplierService
    {

        Task<List<RequestForProposal>> CheckForNewRequestForProposalsAsync(string senderJwt, Dictionary<string, object> args);

        Task<RequestForProposal> GetRequestForProposalAsync(string requestForProposalId, string senderJwt, Dictionary<string, object> args);

        Task<OkResult> CreateProposalAsync(Proposal proposal, string senderJwt);

        Task<List<PurchaseOrder>> CheckForNewPurchaseOrdersAsync(string senderJwt, Dictionary<string, object> args);

        Task<PurchaseOrder> GetPurchaseOrderAsync(string purchaseOrderId, string senderJwt, Dictionary<string, object> args);




    }
}