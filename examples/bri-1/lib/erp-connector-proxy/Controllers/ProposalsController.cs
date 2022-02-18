using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Unibright.Connector.Radish34proxy.Model;
using radishproxy.API.Domain.Services;
using System.Net;
using radishproxy.API.Domain.Repositories;

namespace radishproxy.API.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class ProposalsController : Controller
    {
        private readonly IRadish34BuyerService _radish34BuyerService;
        private readonly IRadish34SupplierService _radish34SupplierService;
        private readonly IRadish34Repository _radish34Repository;
        public ProposalsController(IRadish34BuyerService radish34buyerService, IRadish34SupplierService radish34SupplierService, IRadish34Repository radish34Repository)
        {
            this._radish34BuyerService = radish34buyerService;
            this._radish34SupplierService = radish34SupplierService;
            this._radish34Repository = radish34Repository;
        }

        //GET api/proposals
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<Proposal>))]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        public async Task<List<Proposal>> GetAllAsync()
        {
            var senderJwt = _radish34Repository.GetJwtFromRequest(Request.Headers);
            return await _radish34BuyerService.CheckForNewProposalsAsync(senderJwt, new Dictionary<string, object>());
        }

        // GET api/proposals/5
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(Proposal))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        public async Task<Proposal> GetAsync(string id)
        {
            var senderJwt = _radish34Repository.GetJwtFromRequest(Request.Headers);
            return await _radish34BuyerService.GetProposalAsync(id, senderJwt, new Dictionary<string, object>());
        }

        // POST api/proposals
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        [ProducesResponseType((int)HttpStatusCode.UnprocessableEntity)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        public async Task<OkResult> PostAsync([FromBody] Proposal value)
        {
            var senderJwt = _radish34Repository.GetJwtFromRequest(Request.Headers);
            return await _radish34SupplierService.CreateProposalAsync(value, senderJwt);
        }

    }
}