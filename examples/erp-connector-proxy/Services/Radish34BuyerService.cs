using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Newtonsoft.Json;
using Unibright.Connector.Radish34proxy.Model;
using radishproxy.API.Domain.Services;


namespace radishproxy.API.Services
{
    public class Radish34BuyerService : IRadish34BuyerService
    {
        private readonly IRadish34Service _radish34Service;

        public Radish34BuyerService(IRadish34Service radish34Service)
        {
            this._radish34Service = radish34Service;
        }

        public async Task<StatusCodeResult> CreateRequestForProposalAsync(RequestForProposal requestForProposal, string senderJwt)
        {
            if (requestForProposal.Items != null && requestForProposal.Items.Count > 0 && requestForProposal.Items.First().OrderItemId > 0)
            {
                var result = await _radish34Service.CreateAgreement(requestForProposal, senderJwt);


                return await Task.Run(() => new OkResult());
            }
            else
                return await Task.Run(() => new StatusCodeResult(510));
        }
        public async Task<List<Proposal>> CheckForNewProposalsAsync(string senderJwt, Dictionary<string, object> args)
        {
            var result = await _radish34Service.ListAgreements(args, senderJwt);
            var proposals = JsonConvert.DeserializeObject<List<Proposal>>(result.Item2);

            return proposals;
        }



        public async Task<Proposal> GetProposalAsync(string proposalId, string senderJwt, Dictionary<string, object> args)
        {
            var result = await _radish34Service.GetAgreement(proposalId, senderJwt, args);
            var proposal = JsonConvert.DeserializeObject<Proposal>(result.Item2);

            return proposal;
        }

        public async Task<OkResult> CreatePurchaseOrderAsync(PurchaseOrder purchaseOrder, string senderJwt)
        {
            var result = await _radish34Service.CreateAgreement(purchaseOrder, senderJwt);
            return await Task.Run(() => new OkResult());
        }


    }
}