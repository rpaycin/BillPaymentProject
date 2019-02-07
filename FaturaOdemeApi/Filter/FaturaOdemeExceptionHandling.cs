using FaturaOdemeApi.Models;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Filters;

namespace FaturaOdemeApi.Filter
{

    public class FaturaOdemeExceptionHandling : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            context.Response = new HttpResponseMessage(System.Net.HttpStatusCode.InternalServerError)
            {
                Content = new ObjectContent<ExceptionResponse>(new ExceptionResponse
                {
                    ErrorCode = "999",
                    ErrorMessage = "Bir hata oluştu, lütfen tekrar deneyiniz"
                }, new JsonMediaTypeFormatter())
            };
        }
    }

}