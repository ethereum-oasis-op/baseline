using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Unibright.Connector.Radish34proxy.Model;
using radishproxy.API.Domain.Services;
using radishproxy.API.Domain.Repositories;
using System.Net;

namespace radishproxy.API.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class RequestForProposalsController : Controller
    {
        private readonly IRadish34BuyerService _radish34BuyerService;
        private readonly IRadish34SupplierService _radish34SupplierService;

        private readonly IRadish34Repository _radish34Repository;

        public RequestForProposalsController(IRadish34BuyerService radish34BuyerService, IRadish34SupplierService radish34SupplierService, IRadish34Repository radish34Repository)
        {
            this._radish34BuyerService = radish34BuyerService;
            this._radish34SupplierService = radish34SupplierService;
            this._radish34Repository = radish34Repository;
        }

        //GET api/requestForProposals
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<RequestForProposal>))]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        public async Task<List<RequestForProposal>> GetAllAsync()
        {
            var senderJwt = _radish34Repository.GetJwtFromRequest(Request.Headers);
            return await _radish34SupplierService.CheckForNewRequestForProposalsAsync(senderJwt, new Dictionary<string,object>());
        }

        // GET api/requestForProposals/5
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(RequestForProposal))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        public async Task<RequestForProposal> GetAsync(string id)
        {
            var senderJwt = _radish34Repository.GetJwtFromRequest(Request.Headers);
            return await _radish34SupplierService.GetRequestForProposalAsync(id,senderJwt,new Dictionary<string, object>());
            
        }

        // POST api/requestForProposals
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        [ProducesResponseType((int)HttpStatusCode.UnprocessableEntity)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        public async Task<StatusCodeResult> PostAsync([FromBody] RequestForProposal value)
        {
            var senderJwt = _radish34Repository.GetJwtFromRequest(Request.Headers);
            return await _radish34BuyerService.CreateRequestForProposalAsync(value, senderJwt);
        }
    }
}