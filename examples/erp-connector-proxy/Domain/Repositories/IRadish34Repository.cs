using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using radishproxy.API.Domain.Model;

namespace radishproxy.API.Domain.Repositories
{
    public interface IRadish34Repository
    {

        string GetJwtFromRequest(IHeaderDictionary header);
        Participant GetParticipantFromRequest(IHeaderDictionary headers);
        void UpdateParticipants(string email, string jwtToken);
        List<string> GetRecipientAddresses(Agreement agreement, string senderJwt);
        void StoreAgreement(Agreement agreement);
        string GetReferencedBaselineId(Agreement agreement);
    }
}