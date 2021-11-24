using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http;
using AuthenticationUtility;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Text;
using System.Reflection;
using Newtonsoft.Json.Linq;

namespace BaselineApi.Controllers.Proposal
{
    public class Proposal
    {
        public string rfqCaseId { get; set; }
        public string purchQty { get; set; }
        public string purchUnit { get; set; }
        public string purchPrice { get; set; }
        public string lineNum { get; set; }

    }

    public class ProposalController : ApiController
    {
        public static string RFQStatusCheck = ClientConfiguration.Default.UriString + "data" + "/RequestForQuotationReplyHeaders?$select=RFQCaseNumber,HighestRFQStatus&$filter=RFQCaseNumber%20eq%20";
        public static string ODataEntityPath = ClientConfiguration.Default.UriString + "data";
        public static string ManageProposalActionPath = "/HandleRFQReplies/Microsoft.Dynamics.DataEntities.manageProposal";
        public static string MediaType = "application/json";

        // GET: api/Proposal/000385
        public async Task<bool> Get(int id)
        {
            HttpClient client = new HttpClient();

            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaType));

            var authenticationHeader = OAuthHelper.GetAuthenticationHeader(useWebAppAuthentication: true);
            string[] splittedToken = authenticationHeader.Split(' ');

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", splittedToken[1]);

            string rfqUrl = RFQStatusCheck + "%27" + id.ToString("D6") + "%27";
            var response = await client.GetAsync(rfqUrl);
            var contents = await response.Content.ReadAsStringAsync();

            dynamic json = JsonConvert.DeserializeObject(contents);
            dynamic rfqValue = json["value"];
            
            if (rfqValue.Count > 0)
            {
                string status = rfqValue[0]["HighestRFQStatus"];

                if (status == "Sent")
                {
                    return true;
                }
            }

            return false;
        }

        // POST: api/Proposal
        public async Task<string> Post(Proposal value)
        {
            HttpClient client = new HttpClient();

            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaType));

            var authenticationHeader = OAuthHelper.GetAuthenticationHeader(useWebAppAuthentication: true);
            string[] splittedToken = authenticationHeader.Split(' ');

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", splittedToken[1]);

            PropertyInfo[] proposalInfos = value.GetType().GetProperties();
            Dictionary<string, string> proposalDictionary = new Dictionary<string, string>();

            foreach (PropertyInfo info in proposalInfos)
            {
                proposalDictionary.Add(info.Name, info.GetValue(value, null).ToString());
            }

            var json = JsonConvert.SerializeObject(proposalDictionary, Formatting.Indented);

            var stringContent = new StringContent(json, Encoding.UTF8, MediaType);

            var response = await client.PostAsync(ODataEntityPath + ManageProposalActionPath, stringContent);
            var contents = await response.Content.ReadAsStringAsync();

            return contents;
        }
    }
}
