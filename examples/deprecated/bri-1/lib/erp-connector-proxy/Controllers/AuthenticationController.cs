using System.Net;
using Microsoft.AspNetCore.Mvc;
using radishproxy.API.Domain.Model;
using radishproxy.API.Domain.Services;
using System.Threading.Tasks;
using System.Text;

namespace radishproxy.API.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class AuthenticationController : Controller
    {
        private readonly IRadish34Service _radish34Service;

        public AuthenticationController(IRadish34Service radish34Service)
        {
            this._radish34Service = radish34Service;
        }

        /// <summary>
        /// The Authentication Service is forwarding the Authentication Request to the Provide Ident Stack
        /// The result token needs to be included in following requests as Authorization Bearer Token
        /// </summary>
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.Created, Type = typeof(string))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]

        public async Task<IActionResult> AuthenticateAsync([FromBody] AuthRequest req)
        {
            var authResult = await _radish34Service.AuthenticateOrgAsync(req.email, req.password);
            if (authResult.Item1)
            {
                return Created(nameof(AuthenticateAsync), Encoding.UTF8.GetString(authResult.Item2));
            }
            else
            {
                return NotFound();
            }
        }


        /// <summary>
        /// Implicit check for Authentication by ClaimRequirement
        /// </summary>
        /// <returns></returns>
        [HttpGet("CheckAuthentication")]
        [ClaimRequirement("Authorization", "CanReadResource")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        public async Task<IActionResult> CheckAuthenticationAsync()
        {
            return await Task.Run(() => Ok("Authorized"));
        }


    }
}
