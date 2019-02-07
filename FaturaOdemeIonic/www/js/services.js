angular.module('app.services', [])

.factory('sharedUtils', ['$ionicLoading', '$ionicPopup', function ($ionicLoading, $ionicPopup) {
    var functionObj = {};

    functionObj.showLoading = function () {
        $ionicLoading.show({
            content: '<i class=" ion-loading-c"></i> ',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    };
    functionObj.hideLoading = function () {
        $ionicLoading.hide();
    };

    functionObj.showAlert = function (title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });
        return alertPopup;
    };

    return functionObj;
}])

.factory('CheckBills', function () {
    var checkBills = [{
        billPayingMenuId: 0,
        checkDate: 'Agustos 2016',
        memberNumber: '123456789',
        price: '73 ₺',
        imgPath: "img/billPayingMenu/electricty.png"
    }, {
        billPayingMenuId: 1,
        checkDate: 'Agustos 2016',
        memberNumber: '123456789',
        price: '28 ₺',
        imgPath: "img/billPayingMenu/water.png"
    }, {
        billPayingMenuId: 0,
        checkDate: 'Temmuz 2016',
        memberNumber: '123456789',
        price: '55 ₺',
        imgPath: "img/billPayingMenu/electricty.png"
    }, {
        billPayingMenuId: 2,
        checkDate: 'Haziran 2016',
        memberNumber: '123456789',
        price: '52 ₺',
        imgPath: "img/billPayingMenu/gas.png"
    }, {
        billPayingMenuId: 3,
        checkDate: 'Temmuz 2016',
        memberNumber: '123456789',
        price: '10 ₺',
        imgPath: "img/billPayingMenu/phone.png"
    }, {
        billPayingMenuId: 4,
        checkDate: 'Temmuz 2016',
        memberNumber: '123456789',
        price: '35 ₺',
        imgPath: "img/billPayingMenu/cellPhone.png"
    }, {
        billPayingMenuId: 1,
        checkDate: 'Haziran 2016',
        memberNumber: '123456789',
        price: '34 ₺',
        imgPath: "img/billPayingMenu/water.png"
    }, {
        billPayingMenuId: 2,
        checkDate: 'Mayis 2016',
        memberNumber: '123456789',
        price: '156 ₺',
        imgPath: "img/billPayingMenu/gas.png"
    }, {
        billPayingMenuId: 3,
        checkDate: 'Haziran 2016',
        memberNumber: '123456789',
        price: '200 ₺',
        imgPath: "img/billPayingMenu/phone.png"
    }, {
        billPayingMenuId: 4,
        checkDate: 'Temmuz 2016',
        memberNumber: '123456789',
        price: '156 ₺',
        imgPath: "img/billPayingMenu/cellPhone.png"
    }];

    return {
        all: function () {
            return checkBills;
        },
        remove: function (checkBill) {
            checkBills.splice(checkBills.indexOf(checkBill), 1);
        },
        get: function (checkBillId) {
            for (var i = 0; i < checkBills.length; i++) {
                if (checkBills[i].id === parseInt(checkBillId)) {
                    return checkBills[i];
                }
            }
            return null;
        }
    };
})

.factory('BillBasketOperation', function ($rootScope, PratikOdemeConsts, HelperMethods) {
    return {
        getBillByPaymentNo: function (billPaymentNo) {
            for (var i = 0; i < $rootScope.paymentBillBasket.length; i++) {
                if ($rootScope.paymentBillBasket[i].FaturaNo == billPaymentNo) {
                    return $rootScope.paymentBillBasket[i];
                }
            }
            return null;
        },
        removePaymentBill: function (paymentBill) {
            $rootScope.paymentBillBasket.splice($rootScope.paymentBillBasket.indexOf(paymentBill), 1);
        },
        getTotalPaymentBasket: function () {
            var total = 0;
            for (var i = 0; i < $rootScope.paymentBillBasket.length; i++) {
                total += $rootScope.paymentBillBasket[i].Tutar;
            }
            return total;
        },
        addBillToBasket: function (billPayment, corporationNo, corporationKey, customerName, value1, value2, value3, billPaymentTypeImgPath, billPayingType) {
            var isBasketAdd = true;

            if (billPayment.Tutar == 0)
                return;

            for (var i = 0; i < $rootScope.paymentBillBasket.length; i++) {
                if ($rootScope.paymentBillBasket[i].FaturaNo == billPayment.FaturaNo) {
                    isBasketAdd = false;
                    break;
                }
            }
            if (isBasketAdd) {
                var newBasketItem = {
                    "KullaniciAdi": PratikOdemeConsts.TestUser,
                    "KullaniciSifresi": PratikOdemeConsts.TestPassword,
                    "GuncelTarih": HelperMethods.getDateTimeNow(),
                    "KurumNo": corporationNo,
                    "KurumAnahtar": corporationKey,
                    "MusteriIsmi": customerName,
                    "Deger1": value1,
                    "Deger2": value2,
                    "Deger3": value3,
                    "FaturaNo": billPayment.FaturaNo,
                    "SonOdemeTarihi": billPayment.SonOdemeTarihi,
                    "Tutar": billPayment.Tutar,
                    "GecikmeBedeli": billPayment.GecikmeBedeli,
                    "Komisyon": billPayment.Komisyon,
                    "Sira": billPayment.Sira,
                    "SepetNo": 0,
                    "Anahtar1": billPayment.Anahtar1,
                    "Anahtar2": billPayment.Anahtar2,
                    "Anahtar3": billPayment.Anahtar3,
                    "TipImgPath": billPaymentTypeImgPath,//fatura ödeme de tip resmi yok,
                    "Tip": billPayingType//fatura ödeme tip yok
                };

                $rootScope.paymentBillBasket.push(newBasketItem);
            }

            return isBasketAdd;
        }
    }
})

.factory('ApiRequestModel', function (PratikOdemeConsts, HelperMethods) {
    return {
        getCorporationRequest: function (billPayingType) {
            return {
                "KullaniciAdi": PratikOdemeConsts.TestUser,
                "KullaniciSifresi": PratikOdemeConsts.TestPassword,
                "GuncelTarih": HelperMethods.getDateTimeNow(),
                "Favori": 0,
                "Tip": billPayingType,
                "Sayfa": 0,
                "Arama": ""
            }
        },
        checkBillPaymentRequest: function (corporationCode, value1, value2, value3) {
            return {
                "KullaniciAdi": PratikOdemeConsts.TestUser,
                "KullaniciSifresi": PratikOdemeConsts.TestPassword,
                "GuncelTarih": HelperMethods.getDateTimeNow(),
                "KurumNo": corporationCode,
                "Deger1": value1,
                "Deger2": value2,
                "Deger3": value3
            }
        },
        iyzicoPaymentRequest: function (payment) {
            return {
                //TODO : Burdaki tüm bilgileri SOR
                "ConversationId": HelperMethods.randomString(5),
                "PaymentChannel": 0,
                "PaymentCard": {
                    "CardHolderName": payment.CardHolderName,
                    "CardNumber": payment.CardNumber,
                    "ExpireYear": payment.ExpireYear,
                    "ExpireMonth": payment.ExpireMonth,
                    "Cvc": payment.Cvc,
                    "RegisterCard": 0
                },
                "BillingAddress": {
                    "address": "Kaptanpaşa Mahallesi Darulaceze Caddesi No:45 Famas İş Merkezi A Blok Kat:2 Şişli",
                    "zipCode": "34732",
                    "contactName": "Emin Soyer",
                    "city": "Istanbul",
                    "country": "Turkiye"
                },
                "buyer": {
                    "id": "BY789",
                    "name": "Emin",
                    "surname": "Soyer",
                    "identityNumber": "12345678912",
                    "email": "bilgi@pratikislem.com.tr",
                    "gsmNumber": "0212 286 60 60",
                    "registrationAddress": "Kaptanpaşa Mahallesi Darulaceze Caddesi No:45 Famas İş Merkezi A Blok Kat:2 Şişli",
                    "city": "İSTANBUL",
                    "country": "Turkiye",
                    "zipCode": "34732",
                    "ip": "85.34.78.112"
                },
                "BasketItems": []
            }
        },
        iyzicoBasketItem: function (price, name, number) {
            return {
                "id": HelperMethods.randomString(5),
                "price": price,
                "name": name,
                "category1": number,
                "category2": number,
                "itemType": "VIRTUAL"
            }
        },
        payBillRequest: function (basketItem,iyzicoPaymentId) {
            return {
                "KullaniciAdi": PratikOdemeConsts.TestUser,
                "KullaniciSifresi": PratikOdemeConsts.TestPassword,
                "GuncelTarih": HelperMethods.getDateTimeNow(),
                "KurumNo": basketItem.KurumNo,
                "KurumAnahtar": basketItem.KurumAnahtar,
                "MusteriIsmi": basketItem.MusteriIsmi,
                "Deger1": basketItem.Deger1,
                "Deger2": basketItem.Deger2,
                "Deger3": basketItem.Deger3,
                "FaturaNo": basketItem.FaturaNo,
                "SonOdemeTarihi": basketItem.SonOdemeTarihi,
                "Tutar": basketItem.Tutar,
                "GecikmeBedeli": basketItem.GecikmeBedeli,
                "Komisyon": basketItem.Komisyon,
                "Sira": basketItem.Sira,
                "SepetNo": basketItem.SepetNo,
                "Anahtar1": basketItem.Anahtar1,
                "Anahtar2": basketItem.Anahtar2,
                "Anahtar3": basketItem.Anahtar3,
                "iyzicoOdemeId": iyzicoPaymentId
            }

        }
    }
})

.factory('ApiInvoke', function ($http, $rootScope, PratikOdemeConsts, ApiRequestModel, sharedUtils) {

    return {
        //kurumsal liste
        getCorporationList: function (billPayingType) {
            sharedUtils.showLoading();

            var request = ApiRequestModel.getCorporationRequest(billPayingType);

            var url = PratikOdemeConsts.ApiUrl + "/kurumlar?ServisTip=API&Bicim=json";

            return $http.post(url, request).success(function (response) {
                sharedUtils.hideLoading();
            }).error(function (data) {
                sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, PratikOdemeConsts.ApiErrorMessage);
                sharedUtils.hideLoading();
            });;
        },
        //fatura sorgulama
        checkBillPayment: function (corporationCode, value1, value2, value3) {
            sharedUtils.showLoading();

            var request = ApiRequestModel.checkBillPaymentRequest(corporationCode, value1, value2, value3);

            var url = PratikOdemeConsts.ApiUrl + "/fatura_sorgula?ServisTip=API&Bicim=json";

            return $http.post(url, request).success(function (response) {
                sharedUtils.hideLoading();
            }).error(function (data) {
                sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, PratikOdemeConsts.ApiErrorMessage);
                sharedUtils.hideLoading();
            });;
        },
        //fatura ödeme
        payBill: function (payment) {
            sharedUtils.showLoading();

            //iyzico ödeme
            var iyzicoApiUrl = PratikOdemeConsts.IyzicoApiUrl + "api/Iyzico/BillPayment";
            var iyzicoRequest = ApiRequestModel.iyzicoPaymentRequest(payment);

            //sepetteki ürünler ekleniyor
            for (var i = 0; i < $rootScope.paymentBillBasket.length; i++) {
                var price = $rootScope.paymentBillBasket[i].Tutar / 100;//TODO : fiyat 100 e bölünüp mü iyzicoya gönderilcek ???

                var basketItem = ApiRequestModel.iyzicoBasketItem(price, $rootScope.paymentBillBasket[i].Tip, $rootScope.paymentBillBasket[i].Deger1);

                iyzicoRequest.BasketItems.push(basketItem);
            }

            return $http.post(iyzicoApiUrl, iyzicoRequest, {
                headers: { "Authorization": PratikOdemeConsts.IyzicoApiAuthorization }
            }).success(function (iyzicoResponse) {
                if (iyzicoResponse.IsSuccess) {
                    var iyzicoPaymentId = iyzicoResponse.Value.PaymentId;

                    //pratik islem ödeme bilgilendirme
                    for (var i = 0; i < $rootScope.paymentBillBasket.length; i++) {
                        var request = ApiRequestModel.payBillRequest($rootScope.paymentBillBasket[i], iyzicoPaymentId);

                        var url = PratikOdemeConsts.ApiUrl + "/fatura_ode?ServisTip=API&Bicim=json";

                        $http.post(url, request).success(function (response) {

                        });
                    }
                }
                sharedUtils.hideLoading();
            }).error(function (data) {
                sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, PratikOdemeConsts.ApiErrorMessage);
                sharedUtils.hideLoading();
            });
        }
    }
});


