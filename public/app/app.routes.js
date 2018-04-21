var app = angular.module('mainApp', ['ngRoute']);


app.config(function ($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'app/views/view.html',
		controller: 'Controller',
	})
	.otherwise('/')
});
