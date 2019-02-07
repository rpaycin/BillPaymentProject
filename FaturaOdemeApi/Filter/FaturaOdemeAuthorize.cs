using System;
using System.Net.Http.Headers;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace FaturaOdemeApi.Filter
{
    public class FaturaOdemeAuthorize : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            AuthenticationHeaderValue auth = actionContext.Request.Headers.Authorization;
            if (string.Compare(auth.Scheme, "Basic", StringComparison.OrdinalIgnoreCase) == 0)
            {
                string credentials = UTF8Encoding.UTF8.GetString(Convert.FromBase64String(auth.Parameter));
                int separatorIndex = credentials.IndexOf(':');
                if (separatorIndex >= 0)
                {
                    string userName = credentials.Substring(0, separatorIndex);
                    string password = credentials.Substring(separatorIndex + 1);

                    return (userName == Config.ApiUserName && password == Config.ApiPassword);
                }
            }
            return false;
        }
    }
}