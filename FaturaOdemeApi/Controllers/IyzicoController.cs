using FaturaOdemeApi.Filter;
using FaturaOdemeApi.Helper;
using FaturaOdemeApi.Iyzico;
using FaturaOdemeApi.Models;
using Iyzipay.Model;
using System;
using System.Web.Http;

namespace FaturaOdemeApi.Controllers
{
    [FaturaOdemeAuthorize]
    public class IyzicoController : ApiController
    {
        public Response<Payment> BillPayment(PaymentRequestModel request)
        {
            //request doğrulama
            Verify.ValidateRequestItem(request.BillingAddress != null, "Fatura adresi boş olmamalıdır");
            Verify.ValidateRequestItem(request.PaymentCard != null, "Kart bilgileri boş olmamalıdır");
            Verify.ValidateRequestItem(Enum.IsDefined(typeof(PaymentChannel), request.PaymentChannel), "Tanımlı ödeme kanalı girilmelidir");
            Verify.ValidateRequestItem(request.BasketItems != null && request.BasketItems.Count > 0, "Sepet boş olmamalıdır");

            //fatura ödeme
            Payment paymentResponse = new PaymentWorks().DoPayment(request);

            return new Response<Payment>
            {
                ErrorCode = paymentResponse.ErrorCode,
                ErrorMessage = paymentResponse.ErrorMessage,
                Value = paymentResponse
            };
        }
    }
}
