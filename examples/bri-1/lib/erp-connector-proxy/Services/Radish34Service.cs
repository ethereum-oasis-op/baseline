using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using provide;
using radishproxy.API.Domain.Services;
using radishproxy.API.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace radishproxy.API.Services
{
    public class Radish34Service : IRadish34Service
    {
        private readonly IConfiguration _configuration;
        private readonly IRadish34Repository _repository;

        private readonly ILogger<Radish34Service> _logger;


        // the user's authorized Ident instance
        private Ident _ident;
        //In-memory dictionary for baseline services
        private readonly Dictionary<string, Baseline> _baselineServices;

        public Radish34Service(IConfiguration configuration, IRadish34Repository repository, ILogger<Radish34Service> logger)
        {
            _configuration = configuration;
            _repository = repository;
            _logger = logger;
            _baselineServices = new Dictionary<string, Baseline>();
        }

        #region Authentication, JWT, Ident and Orgs 

        public async Task<(bool, byte[])> AuthenticateOrgAsync(string email, string password)
        {
            bool isAuthenticated = false;
            byte[] token = null;

            try
            {
                _logger.LogTrace("calling Ident Authenticate");
                var userAuthResponse = await Ident.Authenticate(email, password);

                if (userAuthResponse.Item1 == 201)
                {
                    _logger.LogInformation(String.Format("Ident Authentication succesful for email {0}", email), userAuthResponse);

                    var tkn_dict = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, object>>>(userAuthResponse.Item2);
                    if (tkn_dict.ContainsKey("token"))
                    {
                        var tkn_dict_inner = tkn_dict["token"];
                        if (tkn_dict_inner.ContainsKey("token"))
                        {
                            var tkn_str = tkn_dict_inner["token"];

                            _logger.LogTrace("calling InitIdent");
                            this._ident = Ident.InitIdent(tkn_str.ToString());

                            var orgId = await this.fetchDefaultOrganizationIdAsync();
                            if (orgId != null)
                            {
                                token = await this.vendOrganizationJWTAsync(orgId);
                            }

                            isAuthenticated = token != null;

                            if (isAuthenticated)
                            {
                                _logger.LogInformation(String.Format("Token Vending Authentication succesful for email {0}", email));

                                _repository.UpdateParticipants(email, Encoding.UTF8.GetString(token));
                            }
                        }
                        else
                        {
                            _logger.LogError("Inner dictionary of Ident response does not contain 'token' key");
                        }
                    }
                    else
                    {
                        _logger.LogError("Ident response does not contain 'token' key");
                    }

                }
                else
                {
                    _logger.LogError("Ident Authentication did not work: {0}, {1}", userAuthResponse.Item1, userAuthResponse.Item2);
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Unexpected Exception in Authenticate");
            }

            return (isAuthenticated, token);
        }

        private async Task<string> fetchDefaultOrganizationIdAsync()
        {
            string defaultOrganizationId = null;

            try
            {
                _logger.LogTrace("calling Ident.ListOrganizations");
                var identResp = await this._ident.ListOrganizations(new Dictionary<string, object>());
                if (identResp.Item1 == 200)
                {
                    var orgs = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(identResp.Item2);
                    if (orgs.Count > 0 && orgs[0].ContainsKey("id"))
                    {
                        defaultOrganizationId = orgs[0]["id"].ToString();
                    }
                    else
                    {
                        _logger.LogError("No OrgID found {0}", identResp.Item2);
                    }
                }
                else
                {
                    _logger.LogError("Error in ListOrganization: {0}, {1}", identResp.Item1, identResp.Item2);
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Unexpected Exception in fetchDefaultOrganizationIdAsync");
            }

            return defaultOrganizationId;
        }

        private async Task<byte[]> vendOrganizationJWTAsync(string organizationId)
        {
            byte[] authorizedOrgJWT = null;

            try
            {
                _logger.LogTrace("calling Ident.CreateToken");
                var identResp = await this._ident.CreateToken(new Dictionary<string, object>
                {
                    { "aud", "goldmine" },
                    { "scope", String.Format("organization:{0}", organizationId) },
                });

                if (identResp.Item1 == 201)
                {
                    var tok = JsonConvert.DeserializeObject<Dictionary<string, object>>(identResp.Item2);
                    if (tok.ContainsKey("token"))
                    {
                        authorizedOrgJWT = Encoding.UTF8.GetBytes(tok["token"].ToString());
                    }
                    else
                    {
                        _logger.LogError("No token found {0}", identResp.Item2);
                    }
                }
                else
                {
                    _logger.LogError("No OrgToken vended {0}", identResp.Item2);
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Unexpected Exception in vendOrganizationJWTAsync");
            }

            return authorizedOrgJWT;
        }

        #endregion

        #region Baseline Services
        private Baseline getBaselineService(string participantsJwt)
        {
            Baseline ret = null;

            try
            {
                if (!_baselineServices.ContainsKey(participantsJwt))
                {
                    _logger.LogTrace("calling Baseline constructor");
                    _baselineServices[participantsJwt] = new Baseline(participantsJwt);
                }

                ret = _baselineServices[participantsJwt];
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Unexpected Exception in getBaselineService");
            }
            return ret;
        }


        public async Task<IActionResult> CreateAgreement(Agreement agreement, string senderJwt)
        {
            //get the addresses of the recipients, telling from the sender, object and internal ID
            List<string> recipients = _repository.GetRecipientAddresses(agreement, senderJwt);

            //get the referenced baseline ID
            if (String.IsNullOrEmpty(agreement.ReferencedAgreementId))
                agreement.ReferencedAgreementId = _repository.GetReferencedBaselineId(agreement);

            //get a baseline service
            var bline = getBaselineService(senderJwt);

            var json = JsonConvert.SerializeObject(agreement);
            var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

            try
            {
                _logger.LogTrace("calling Baseline constructor");
                var baselinedAgreement = await bline.CreateAgreement(dict, recipients.ToArray());

                if (baselinedAgreement.Item1 == 201 && baselinedAgreement.Item2 != null)
                {
                    var resp = JsonConvert.DeserializeObject<Dictionary<string, object>>(baselinedAgreement.Item2);
                    if (resp.ContainsKey("id"))
                    {
                        var baselinedAgreementId = resp["id"];
                        _logger.LogInformation("Got valid response from baseline api connector; baseline agreement id: {0}", baselinedAgreementId);

                        // associate the baselined agreement id with the agreement!
                        agreement.AgreementId = baselinedAgreementId.ToString();

                        _repository.StoreAgreement(agreement);

                        return new OkResult();
                    }
                    else
                    {
                        _logger.LogError("ID not found in {0}", resp);
                        return new BadRequestResult();
                    }

                }
                else
                {
                    _logger.LogError("Error in create Agreement: {0}, {1}", baselinedAgreement.Item1);
                    return new UnprocessableEntityResult();
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Unexpected Exception in CreateAgreement");
                return new BadRequestResult();

            }
        }

        public async Task<IActionResult> UpdateAgreement(string agreementId, Agreement agreement, string senderJwt)
        {
            //get a baseline service
            var bline = getBaselineService(senderJwt);

            var json = JsonConvert.SerializeObject(agreement);
            var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

            var baselinedAgreement = await bline.UpdateAgreement(agreementId, dict);

            if (baselinedAgreement.Item1 == 201 && baselinedAgreement.Item2 != null)
            {
                _repository.StoreAgreement(agreement);

                return new OkResult();
            }
            else
            {
                return new NotFoundObjectResult(agreement);
            }
        }

        public async Task<(int, string)> GetAgreement(string agreementId, string senderJwt, Dictionary<string, object> args)
        {
            //get a baseline service
            var bline = getBaselineService(senderJwt);

            var baselinedAgreement = await bline.GetAgreement(agreementId, args);
            return baselinedAgreement;
        }

        public async Task<(int,string)> ListAgreements(Dictionary<string, object> args, string senderJwt)
        {
            //get a baseline service
            var bline = getBaselineService(senderJwt);

            var baselinedAgreement = await bline.ListAgreements(args);

            return baselinedAgreement;
        }


        #endregion

        
    }
}