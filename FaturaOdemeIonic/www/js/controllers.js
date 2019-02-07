angular.module('app.controllers', ['app.sqlite', 'app.modal.controllers'])

//Index
.controller('indexCtrl', function ($scope, $rootScope, $state, sharedUtils, PratikOdemeConsts) {

    $scope.goBasketList = function () {
        //boş sepet kontrolü
        if ($rootScope.paymentBillBasket.length <= 0) {
            sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, "Sepetiniz boş.<br/> Lütfen fatura sorgulaması yapınız.");
            return;
        }
        else {
            $state.go('basketList', {});
        }
    };
})

//Fatura Ödeme Menu
.controller('billPayingMenuCtrl', function ($scope, $state, PratikOdemeConsts, $rootScope, Information, sharedUtils) {
    $scope.menu = PratikOdemeConsts.CorporationTypes;

    $scope.showBillType = function (menuIndex) {
        //iletişim bilgileri alınıyor. 
        if ($rootScope.emailAddress == "") {
            Information.get().then(function (informations) {
                $scope.isInformation = (informations.length > 0);

                if ($scope.isInformation) {
                    $rootScope.emailAddress = informations[0].emailAddress;
                }

                //Fatura sorgulaması için email adresi kontrolü
                if ($rootScope.emailAddress == "") {
                    var alertPopup = sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, "Fatura sorgulması yapmak için email adresinizi girmelisiniz.");
                    alertPopup.then(function (res) {
                        $state.go('information', {});
                    });
                }
                else {
                    $state.go('billPaying', { 'billPayingMenuIndex': menuIndex });
                }
            });
        }
        else {
            $state.go('billPaying', { 'billPayingMenuIndex': menuIndex });
        }
    };
})

//Fatura Ödeme Sorgulama
.controller('billPayingCtrl', function ($scope, $stateParams, PratikOdemeConsts, $ionicModal, ApiInvoke, sharedUtils, $ionicPopup, HelperMethods, BillBasketOperation, $state) {
    //forma boş değer atılıyor
    $scope.clearForm = function () {
        $scope.billPaying = {
            Deger1: "",
            Deger2: "",
            Deger3: ""
        };
    }

    //fatura ödeme menude seçilen değer
    var billPayingType = $stateParams.billPayingMenuIndex;

    //seçilen ödeme tipi detayı alınıyor
    $scope.billPayingItem = PratikOdemeConsts.CorporationTypes[billPayingType - 1];

    //kurum listesi apiden alınıyor
    $scope.corporationList = [];
    ApiInvoke.getCorporationList(billPayingType).success(function (data) {
        $scope.clearForm();

        $scope.corporationList = data;
    });

    //kurum listesi popup ayarları
    $scope.selectedCorporation = {};
    $scope.corporationButton = { "text": 'Seçiniz...' };

    $ionicModal.fromTemplateUrl('templates/modal/corporationList.html', function (modal) {
        $scope.CorporationListCtrl = modal;
    }, {
        scope: $scope,
        focusFirstInput: true
    });

    //kurum liste açılması
    $scope.openCorporationList = function () {
        $scope.clearForm();
        $scope.CorporationListCtrl.show();
    };
    $scope.isShowForm = false;

    //kurumsal liste change event
    $scope.corporationListSelectedChanged = function (item) {
        $scope.isShowForm = true;
        $scope.corporationButton.text = item.Isim;
        $scope.selectedCorporation = item;
        $scope.CorporationListCtrl.hide();

        if (item.Aciklama != "")
            sharedUtils.showAlert(item.Isim, item.Aciklama);
    };

    //form click - fatura sorgulama
    $scope.billPaymentList = [];
    $scope.checkBillPayment = function () {

        //fatura numaraları 0 ile dolduruluyor
        var value1 = HelperMethods.fillZeroDigit($scope.billPaying.Deger1, $scope.selectedCorporation.Deger1.SifirIleDoldur, $scope.selectedCorporation.Deger1.Azami);
        var value2 = HelperMethods.fillZeroDigit($scope.billPaying.Deger2, $scope.selectedCorporation.Deger2.SifirIleDoldur, $scope.selectedCorporation.Deger2.Azami);
        var value3 = HelperMethods.fillZeroDigit($scope.billPaying.Deger3, $scope.selectedCorporation.Deger3.SifirIleDoldur, $scope.selectedCorporation.Deger3.Azami);

        //apiden fatura sorgulanıyor
        ApiInvoke.checkBillPayment($scope.selectedCorporation.KurumNo, value1, value2, value3).success(function (data) {
            $scope.clearForm();

            $scope.billPaymentList = data;

            if ($scope.billPaymentList.Sonuc == PratikOdemeConsts.ApiErrorText) {
                sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, data.Aciklama);
            }
            else if ($scope.billPaymentList.Faturalar.length == 0) {
                sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, "Ödeme yapılabilecek fatura bulunamadı!");
            }
            else if ($scope.billPaymentList.Faturalar.length == 1) {
                selectedBillPayment = $scope.billPaymentList.Faturalar[0];

                //0 tl kontrol
                if (selectedBillPayment.Tutar == 0) {
                    sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, "Borcunuz bulunmamaktadır.");
                    return;
                }

                var billInfo = $scope.billPaymentList;
                //sepete ekleniyor
                var isBasketAdded = BillBasketOperation.addBillToBasket(selectedBillPayment, billInfo.KurumNo, billInfo.KurumAnahtar, billInfo.MusteriIsmi, billInfo.Deger1, billInfo.Deger2, billInfo.Deger3, $scope.billPayingItem.ImgPath, $scope.billPayingType);

                if (isBasketAdded) {
                    var popupMessage = $scope.billPaymentList.MusteriIsmi + " adli kisinin " + selectedBillPayment.SonOdemeTarihi + " son odeme tarihli " +
                                       selectedBillPayment.FaturaNo + " fatura numarali <b>" + selectedBillPayment.Tutar / 100 + " ₺</b> lik borcu bulunmaktadir<br/>";

                    $scope.showWarningAfterBillPaymentAdd(popupMessage);
                }

            }
            else {
                $scope.CheckBillPaymentListCtrl.show();
            }
        });
    };

    //fatura listesi popup ayarları
    $scope.checkBillPayments = [];
    $ionicModal.fromTemplateUrl('templates/modal/checkBillPaymentList.html', function (modal) {
        $scope.CheckBillPaymentListCtrl = modal;
    }, {
        scope: $scope,
        focusFirstInput: true
    });

    //fatura liste change event
    $scope.getCheckBillPayments = function () {
        $scope.CheckBillPaymentListCtrl.hide();

        var checkCounter = 0;
        //seçilen fatura numaraları loop
        for (billPaymentNo in $scope.checkBillPayments) {
            if ($scope.checkBillPayments[billPaymentNo]) {
                //fatura numarasında fatura bulunmaya çalışılıyor
                for (var i = 0; i < $scope.billPaymentList.Faturalar.length; i++) {
                    if (billPaymentNo == $scope.billPaymentList.Faturalar[i].FaturaNo) {

                        var billInfo = $scope.billPaymentList;
                        var selectedBillPayment = $scope.billPaymentList.Faturalar[i];

                        if (selectedBillPayment.Tutar > 0) {
                            checkCounter++;
                            BillBasketOperation.addBillToBasket(selectedBillPayment, billInfo.KurumNo, billInfo.KurumAnahtar, billInfo.MusteriIsmi, billInfo.Deger1, billInfo.Deger2, billInfo.Deger3, $scope.billPayingItem.ImgPath);
                        }

                        break;
                    }
                }
            }
        }

        $scope.checkBillPayments = [];//seçili listeyi sil

        if (checkCounter > 0)
            $scope.showWarningAfterBillPaymentAdd("");
    };

    //sepete fatura eklendikten sonra kullanıcıya confirm çıkıyor
    $scope.showWarningAfterBillPaymentAdd = function (extraMessage) {
        var popupMessage = extraMessage + "Faturaniz sepetinize eklenmistir<br/>" +
                           "Sepetinize giderek faturalarinizi odeyebilir veya fatura eklemeye devam edebilirsiniz.";

        //fatura sorgulama işleminden sonra kullanıcı sorgulamaya devam edecek veya sepete gidecek
        var confirmPopup = $ionicPopup.confirm({
            title: PratikOdemeConsts.ApplicationName,
            template: popupMessage,
            cancelText: 'Hayir',
            okText: 'Evet'
        });

        confirmPopup.then(function (res) {
            if (res) {
                $state.go('basketList', {});
            }
        });
    };
})

//Sepet Listesi
.controller('basketListCtrl', function ($scope, $rootScope, $state, BillBasketOperation) {
    //toplam sepet tutarı
    $scope.totalPayment = BillBasketOperation.getTotalPaymentBasket();

    //sepet silme
    $scope.removePaymentBill = function (paymentBill) {
        BillBasketOperation.removePaymentBill(paymentBill);

        $scope.totalPayment = BillBasketOperation.getTotalPaymentBasket();

        //sepet boş olursa ana menuye yönlendiriliyor
        if ($rootScope.paymentBillBasket.length <= 0) {
            var alertPopup = sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, "Sepetiniz boş. Yeniden fatura sorgulamalısınız.");
            alertPopup.then(function (res) {
                $state.go('billPayingMenu', {});
            });
        }
    };

    //ödeme sayfasına yönlendirme
    $scope.goPayment = function () {
        $state.go('payment', {});
    };
})

//Ödeme Sayfası
.controller('paymentCtrl', function ($scope, $rootScope, BillBasketOperation, ApiInvoke, $state) {
    $scope.payment = {
        CardHolderName: "",
        CardNumber: "",
        ExpireYear: "",
        ExpireMonth: "",
        Cvc: "",
        CreditCardType: "noPhoto"
    };

    //toplam sepet tutarı
    $scope.totalPayment = BillBasketOperation.getTotalPaymentBasket();

    //ödeme yap buton
    $scope.doPayment = function () {
        ApiInvoke.payBill($scope.payment).success(function (data) {
            /*if (!data.IsSuccess) {
                sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, data.ErrorMessage);
                return;
            }
            */

            $state.go('finalPayment', {});
        });
    };
})

//Ödeme Sonuç
.controller('finalPaymentCtrl', function ($scope, $rootScope, $state, BillBasketOperation) {
    //toplam sepet tutarı
    $scope.totalPayment = BillBasketOperation.getTotalPaymentBasket();

    $scope.basketListCount = $rootScope.paymentBillBasket.length;

    //sepeti silme
    $rootScope.paymentBillBasket.length = 0;

    //yeni fatura sorgulama
    $scope.goBillCheck = function () {
        $state.go('billPayingMenu', {});
    };
})

//Son İşlemler
.controller('lastOperationsCtrl', function ($scope) {
    $scope.lastOperations = [
       {
           "type": "18.08.2016",
           "operations": [
               {
                   "name": "Elektrik - Islem 1"
               },
               {
                   "name": "Elektrik - Islem 2"
               },
               {
                   "name": "Su - Islem 3"
               },
               {
                   "name": "Su - Islem 4"
               },
               {
                   "name": "Telefon - Islem 5"
               },
               {
                   "name": "Telefon - Islem 6"
               },
               {
                   "name": "Cep Telefonu - Islem 7"
               },
               {
                   "name": "Cep Telefonu - Islem "
               }
           ]
       },
       {
           "type": "10.08.2016",
           "operations": [
               {
                   "name": "Elektrik - Islem 1"
               },
               {
                   "name": "Elektrik - Islem 2"
               },
               {
                   "name": "Su - Islem 3"
               },
               {
                   "name": "Su - Islem 4"
               },
               {
                   "name": "Telefon - Islem 5"
               },
               {
                   "name": "Telefon - Islem 6"
               },
               {
                   "name": "Cep Telefonu - Islem 7"
               },
               {
                   "name": "Cep Telefonu - Islem "
               }
           ]
       },
       {
           "type": "07.08.2016",
           "operations": [
               {
                   "name": "Elektrik - Islem 1"
               },
               {
                   "name": "Elektrik - Islem 2"
               },
               {
                   "name": "Su - Islem 3"
               },
               {
                   "name": "Su - Islem 4"
               },
               {
                   "name": "Telefon - Islem 5"
               },
               {
                   "name": "Telefon - Islem 6"
               },
               {
                   "name": "Cep Telefonu - Islem 7"
               },
               {
                   "name": "Cep Telefonu - Islem "
               }
           ]
       },
       {
           "type": "01.08.2016",
           "operations": [
               {
                   "name": "Elektrik - Islem 1"
               },
               {
                   "name": "Elektrik - Islem 2"
               },
               {
                   "name": "Su - Islem 3"
               },
               {
                   "name": "Su - Islem 4"
               },
               {
                   "name": "Telefon - Islem 5"
               },
               {
                   "name": "Telefon - Islem 6"
               },
               {
                   "name": "Cep Telefonu - Islem 7"
               },
               {
                   "name": "Cep Telefonu - Islem "
               }
           ]
       },
       {
           "type": "31.07.2016",
           "operations": [
               {
                   "name": "Elektrik - Islem 1"
               },
               {
                   "name": "Elektrik - Islem 2"
               },
               {
                   "name": "Su - Islem 3"
               },
               {
                   "name": "Su - Islem 4"
               },
               {
                   "name": "Telefon - Islem 5"
               },
               {
                   "name": "Telefon - Islem 6"
               },
               {
                   "name": "Cep Telefonu - Islem 7"
               },
               {
                   "name": "Cep Telefonu - Islem "
               }
           ]
       },
       {
           "type": "08.06.2016",
           "operations": [
               {
                   "name": "Elektrik - Islem 1"
               },
               {
                   "name": "Elektrik - Islem 2"
               },
               {
                   "name": "Su - Islem 3"
               },
               {
                   "name": "Su - Islem 4"
               },
               {
                   "name": "Telefon - Islem 5"
               },
               {
                   "name": "Telefon - Islem 6"
               },
               {
                   "name": "Cep Telefonu - Islem 7"
               },
               {
                   "name": "Cep Telefonu - Islem "
               }
           ]
       }
    ];
})

//Sorgulanan Faturalar
.controller('checkBillsCtrl', function ($scope, CheckBills) {
    $scope.checkBills = CheckBills.all();

    $scope.removeCheckBill = function (checkBill) {
        CheckBills.remove(checkBill);
    };
})

//Hatırlatmalar
.controller('remindingsCtrl', function ($scope) {
    $scope.remaindings = [
        {
            "date": "18.08.2016",
            "remaindingText": "Bilgilendirme text",
        },
        {
            "date": "17.08.2016",
            "remaindingText": "Bilgilendirme text",
        },
        {
            "date": "16.08.2016",
            "remaindingText": "Bilgilendirme text",
        },
        {
            "date": "15.08.2016",
            "remaindingText": "Bilgilendirme text",
        },
        {
            "date": "14.08.2016",
            "remaindingText": "Bilgilendirme text",
        },
        {
            "date": "13.08.2016",
            "remaindingText": "Bilgilendirme text",
        },
        {
            "date": "12.08.2016",
            "remaindingText": "Bilgilendirme text",
        },
        {
            "date": "11.08.2016",
            "remaindingText": "Bilgilendirme text",
        },
        {
            "date": "10.08.2016",
            "remaindingText": "Bilgilendirme text",
        },
        {
            "date": "09.08.2016",
            "remaindingText": "Bilgilendirme text",
        }
    ];
})

//İletisim Bilgileri
.controller('informationCtrl', function ($scope, $state, Information, sharedUtils, PratikOdemeConsts) {
    //$scope.information = JSON.parse(window.localStorage.getItem("information"));

    //iletişim bilgileri alınıyor
    Information.get().then(function (informations) {
        $scope.isInformation = (informations.length > 0);

        if ($scope.isInformation) {
            $scope.information = informations[0];
        }
    });

    ////form kayıt
    $scope.saveForm = function () {
        sharedUtils.showLoading();

        //window.localStorage.setItem("information", angular.toJson($scope.information));

        if (!$scope.isInformation)
            Information.insert($scope.information);
        else
            Information.update($scope.information);

        $rootScope.emailAddress = $scope.information.emailAddress;

        sharedUtils.hideLoading();
        sharedUtils.showAlert(PratikOdemeConsts.ApplicationName, "İletişim bilgileriniz kaydedilmiştir");
    }

    //form iptal
    $scope.cancelForm = function () {
        $state.reload();
    }
})

