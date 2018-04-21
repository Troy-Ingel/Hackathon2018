angular
.module('mainApp')
.config(configSettings);


configSettings.$inject = ['$httpProvider'];

function configSettings($httpProvider){
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

    $httpProvider.defaults.transformRequest = function(data){
        if (data === undefined){
            return data;
        }
        return $.param(data);
    }
}
