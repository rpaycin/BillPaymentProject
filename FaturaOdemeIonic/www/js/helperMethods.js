angular.module('app.helperMethods', [])

.factory('HelperMethods', function ($filter) {
    return {
        //date time now
        getDateTimeNow: function () {
            return $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
        },
        //fatura numaraları 0 ile doldurma
        fillZeroDigit: function (text, isFillZero, maxLengthText) {
            if (text.length == 0 || !isFillZero || text.length > maxLengthText)
                return text;

            var zeroText = "";
            for (var i = 0; i < maxLengthText - text.length; i++) {
                zeroText = zeroText + "0";
            }

            return zeroText + text;
        },
        randomString: function (length) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
    }
});