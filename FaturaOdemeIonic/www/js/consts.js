angular.module('app.consts', [])
.constant('DB_CONFIG', {
    name: 'DB',
    tables: [
      {
          name: 'Information',
          columns: [
              { name: 'cellPhone', type: 'integer' },
              { name: 'telephone', type: 'integer' },
              { name: 'emailAddress', type: 'text' }
          ]
      }
    ]
})
.constant('PratikOdemeConsts', {
    ApplicationName: "Fatura Odeme",
    TestUser: "testuser",
    ApiErrorText: "HATA",
    ApiErrorMessage: "Hata olustu. Lutfen tekrar deneyiniz.",
    TestPassword: "1234",
    ApiUrl: "http://www.faturaodeme.com/bizimvezne",
    CorporationTypes: [
            { Type: 1, Name: "Cep Telefonu", ImgPath: "img/billPayingMenu/cellPhone.png" },
            { Type: 2, Name: "Dogalgaz", ImgPath: "img/billPayingMenu/gas.png" },
            { Type: 3, Name: "Elektrik", ImgPath: "img/billPayingMenu/electricty.png" },
            { Type: 4, Name: "Telefon", ImgPath: "img/billPayingMenu/phone.png" },
            { Type: 5, Name: "Su", ImgPath: "img/billPayingMenu/water.png" },
            { Type: 6, Name: "Internet", ImgPath: "img/billPayingMenu/internet.png" },
    ],
    IyzicoApiUrl: "http://212.98.202.26/FaturaOdemeApi/",
    IyzicoApiAuthorization: "Basic ZkBUdVJAXyYlT2RFbUVAUGk6ZkBUdVJAXyYlT2RFbUVAUGlfUHJAVGlrSXNMZU0="
});