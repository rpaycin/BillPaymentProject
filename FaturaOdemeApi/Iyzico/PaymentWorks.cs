using Iyzipay.Model;
using Iyzipay.Request;
using FaturaOdemeApi.Helper;
using FaturaOdemeApi.Models;
using System.Linq;
using System;

namespace FaturaOdemeApi.Iyzico
{
    public class PaymentWorks : BaseWorks
    {
        public Payment DoPayment(PaymentRequestModel request)
        {
            //sepet toplam tutar
            double totalBasketPrice = request.BasketItems.Sum(b => Convert.ToDouble(b.Price));

            //ödeme isteği
            var paymentRequest = new CreatePaymentRequest();

            paymentRequest.Locale = Iyzipay.Model.Locale.TR.GetName();
            paymentRequest.ConversationId = request.ConversationId;
            paymentRequest.Price = totalBasketPrice.ToString();// Ödeme sepet tutarı. Kırılım tutarlar toplamı sepet tutarına eşit olmalı. Zorunlu
            paymentRequest.PaidPrice = "1";// İndirim, vergi gibi değerlerin dahil edildiği, vade farkı önbcesi tutar değeri. Zorunlu
            paymentRequest.Installment = 1;//taksit. zorunlu
            paymentRequest.BasketId = HelperMethods.RandomString(5);
            paymentRequest.PaymentGroup = PaymentGroup.SUBSCRIPTION.ToString();// Ödeme grubu, varsayılan PRODUCT. Geçerli değerler enum içinde sunulmaktadır: PRODUCT, LISTING, SUBSCRIPTION. Zorunlu değil
            paymentRequest.PaymentChannel = request.PaymentChannel.ToString();//ödeme kanalı. zorunlu değil
            paymentRequest.Currency = Iyzipay.Model.Currency.TRY.ToString();//para birimi. TL
            paymentRequest.CallbackUrl = "https://www.merchant.com/callback";

            paymentRequest.PaymentCard = request.PaymentCard;//kart bilgileri

            paymentRequest.Buyer = request.Buyer;//alıcı bilgileri

            paymentRequest.BillingAddress = request.BillingAddress;//fatura adres bilgileri

            paymentRequest.BasketItems = request.BasketItems;//sepet bilgileri

            //ödeme işlemleri
            Payment paymentResponse = Create(paymentRequest);

            return paymentResponse;
        }

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