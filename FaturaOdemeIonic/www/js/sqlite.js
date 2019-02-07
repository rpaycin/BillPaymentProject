angular.module('app.sqlite', ['app.consts'])
// DB wrapper
.factory('DB', function ($q, DB_CONFIG, $rootScope) {
    var self = this;
    self.db = null;

    self.init = function () {
        try {
            //prod
            if ($rootScope.currentPlatform == "ios") {
                self.db = window.sqlitePlugin.openDatabase({ name: DB_CONFIG.name, location: 2, createFromLocation: 1 }); //prod
            }
            else {
                self.db = window.sqlitePlugin.openDatabase({ name: DB_CONFIG.name, iosDatabaseLocation: 'default' });
            }

            //test
            //self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);

            angular.forEach(DB_CONFIG.tables, function (table) {
                var columns = [];

                angular.forEach(table.columns, function (column) {
                    columns.push(column.name + ' ' + column.type);
                });

                var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
                self.query(query);
                console.log('Table ' + table.name + ' initialized');
            });
        } catch (e) {
            alert(e);
        }

    };

    self.query = function(query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();

        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                deferred.reject(error);
            });
        });

        return deferred.promise;
    };

    self.fetchAll = function(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        
        return output;
    };

    self.fetch = function(result) {
        return result.rows.item(0);
    };

    return self;
})

.factory('Information', function(DB) {
    var self = this;
    
    self.get = function() {
        return DB.query('SELECT * FROM Information')
        .then(function(result){
            return DB.fetchAll(result);
        });
    };

    self.insert = function (information) {
        var result = DB.query('INSERT INTO Information (cellPhone, telephone, emailAddress) VALUES (?,?,?)', [information.cellPhone, information.telephone, information.emailAddress])
        return result;
    };

    self.update = function (information) {
        var result = DB.query('UPDATE Information SET cellPhone = ?, telephone = ?, emailAddress = ?', [information.cellPhone, information.telephone, information.emailAddress])
        return result;
    };
    
    //self.getById = function(id) {
    //    return DB.query('SELECT * FROM Information WHERE id = ?', [id])
    //    .then(function(result){
    //        return DB.fetch(result);
    //    });
    //};
    
    return self;
});