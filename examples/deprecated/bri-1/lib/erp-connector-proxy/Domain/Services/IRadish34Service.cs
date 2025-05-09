using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;


namespace radishproxy.API.Domain.Services
{
    public interface IRadish34Service
    {

        Task<(bool, byte[])> AuthenticateOrgAsync(string email, string password);

        Task<IActionResult> CreateAgreement(Agreement agreement, string senderJwt);
        Task<IActionResult> UpdateAgreement(string agreementId, Agreement agreement, string senderJwt);
        Task<(int, string)> GetAgreement(string agreementId, string senderJwt, Dictionary<string, object> args);
        Task<(int,string)> ListAgreements(Dictionary<string, object> args, string senderJwt);
    }
}
