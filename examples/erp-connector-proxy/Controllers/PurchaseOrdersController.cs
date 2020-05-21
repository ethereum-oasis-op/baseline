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
    public class PurchaseOrdersController : Controller
    {
        private readonly IRadish34BuyerService _radish34BuyerService;
        private readonly IRadish34SupplierService _radish34SupplierService;

        private readonly IRadish34Repository _radish34Repository;

        public PurchaseOrdersController(IRadish34BuyerService radish34buyerService, IRadish34SupplierService radish34SupplierService, IRadish34Repository radish34Repository)
        {
            this._radish34BuyerService = radish34buyerService;
            this._radish34SupplierService = radish34SupplierService;
            this._radish34Repository = radish34Repository;
        }

        //GET api/purchaseOrders
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(List<PurchaseOrder>))]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        public async Task<List<PurchaseOrder>> GetAllAsync()
        {
            var senderJwt = _radish34Repository.GetJwtFromRequest(Request.Headers);
            return await _radish34SupplierService.CheckForNewPurchaseOrdersAsync(senderJwt, new Dictionary<string, object>());
        }

        // GET api/purchaseOrders/5
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(PurchaseOrder))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        public async Task<PurchaseOrder> GetAsync(string id)
        {
            var senderJwt = _radish34Repository.GetJwtFromRequest(Request.Headers);
            return await _radish34SupplierService.GetPurchaseOrderAsync(id, senderJwt, new Dictionary<string, object>());
        }

        // POST api/purchaseOrders
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        [ProducesResponseType((int)HttpStatusCode.UnprocessableEntity)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        public async Task<OkResult> PostAsync([FromBody] PurchaseOrder value)
        {
            var senderJwt = _radish34Repository.GetJwtFromRequest(Request.Headers);
            return await _radish34BuyerService.CreatePurchaseOrderAsync(value, senderJwt);
        }

    }
}