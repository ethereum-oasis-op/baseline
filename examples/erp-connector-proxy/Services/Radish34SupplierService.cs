using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using radishproxy.API.Domain.Services;
using Unibright.Connector.Radish34proxy.Model;

namespace radishproxy.API.Services
{
    public class Radish34SupplierService : IRadish34SupplierService
    {

        private readonly IRadish34Service _radish34Service;

        public Radish34SupplierService(IRadish34Service radish34Service)
        {
            _radish34Service = radish34Service;
        }

        public async Task<List<PurchaseOrder>> CheckForNewPurchaseOrdersAsync(string senderJwt, Dictionary<string, object> args)
        {
            var result = await _radish34Service.ListAgreements(args, senderJwt);
            var purchaseOrders = JsonConvert.DeserializeObject<List<PurchaseOrder>>(result.Item2);

            return purchaseOrders;
        }

        public async Task<PurchaseOrder> GetPurchaseOrderAsync(string purchaseOrderId, string senderJwt, Dictionary<string, object> args)
        {
            var result = await _radish34Service.GetAgreement(purchaseOrderId, senderJwt, args);
            var purchaseOrder = JsonConvert.DeserializeObject<PurchaseOrder>(result.Item2);

            return purchaseOrder;
        }

        public async Task<OkResult> CreateProposalAsync(Proposal proposal, string senderJwt)
        {
            var result = await _radish34Service.CreateAgreement(proposal, senderJwt);
            return await Task.Run(() => new OkResult());

        }

        public async Task<List<RequestForProposal>> CheckForNewRequestForProposalsAsync(string senderJwt, Dictionary<string, object> args)
        {
            var result = await _radish34Service.ListAgreements(args, senderJwt);
            var requestForProposals = JsonConvert.DeserializeObject<List<RequestForProposal>>(result.Item2);

            return requestForProposals;
        }

        public async Task<RequestForProposal> GetRequestForProposalAsync(string requestForProposalId, string senderJwt, Dictionary<string, object> args)
        {
            var result = await _radish34Service.GetAgreement(requestForProposalId, senderJwt, args);
            var requestForProposal = JsonConvert.DeserializeObject<RequestForProposal>(result.Item2);

            return requestForProposal;
        }

    }
}