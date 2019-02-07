using Iyzipay.Model;
using System.Collections.Generic;

namespace FaturaOdemeApi.Models
{
    public class PaymentRequestModel
    {
        public string ConversationId { get; set; }

        public PaymentChannel PaymentChannel { get; set; }

        public PaymentCard PaymentCard { get; set; }

        public Address BillingAddress { get; set; }

        public Buyer Buyer { get; set; }

        public List<BasketItem> BasketItems { get; set; }
    }
}