using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using radishproxy.API.Domain.Repositories;

namespace radishproxy.API.Controllers
{
    public class ClaimRequirementAttribute : TypeFilterAttribute
    {
        public ClaimRequirementAttribute(string claimType, string claimValue) : base(typeof(ClaimRequirementFilter))
        {
            Arguments = new object[] { new Claim(claimType, claimValue) };
        }
    }

    public class ClaimRequirementFilter : IAuthorizationFilter
    {
        readonly Claim _claim;
        readonly IRadish34Repository _radish34Repository;

        public ClaimRequirementFilter(Claim claim, IRadish34Repository radish34Repository)
        {
            _claim = claim;
            _radish34Repository = radish34Repository;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var str = _radish34Repository.GetJwtFromRequest(context.HttpContext.Request.Headers);
            var hasClaim = context.HttpContext.User.Claims.Any(c => c.Type == _claim.Type && c.Value == _claim.Value);
            if (!hasClaim)
            {
                context.Result = new ForbidResult();
            }
        }
    }



}