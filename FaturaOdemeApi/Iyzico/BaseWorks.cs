using Iyzipay;
using Iyzipay.Model;

namespace FaturaOdemeApi.Iyzico
{
    public class BaseWorks : PaymentResource
    {
        public Options options;

        public BaseWorks()
        {
            options = new Options
            {
                ApiKey = Config.IyzicoApiKey,
                SecretKey = Config.IyzicoSecretKey,
                BaseUrl = Config.IyzicoBaseUrl
            };
        }
    }
}