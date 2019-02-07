using Iyzipay;
using Iyzipay.Model;
using Iyzipay.Request;

namespace FaturaOdemeApi.Iyzico
{
    public class Payment : BaseWorks
    {
        public Payment Create(CreatePaymentRequest request)
        {
            return RestHttpClient.Create().Post<Payment>(options.BaseUrl + "/payment/auth", GetHttpHeaders(request, options), request);
        }

        public Payment Retrieve(RetrievePaymentRequest request)
        {
            return RestHttpClient.Create().Post<Payment>(options.BaseUrl + "/payment/detail", GetHttpHeaders(request, options), request);
        }
    }
}