/*

	This is the global module for the application

	Requires bengui-core.js!


*/

$(document).ready(function(){

	Core.loadPage('home', 'index', 'Home');
	Core.defineHomeView('home', 'index', 'Home');

	//Core.initGlobalMenu();
	Core.initGlobalSideMenu();
	Core.initBackButton();
	Core.activityIndicator(false);	
});


$(function() {
    FastClick.attach(document.body);
});