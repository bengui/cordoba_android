/*

	This is the global module for the application

	Requires bengui-core.js!


*/


var sessionData = [];

var sectionPage = 'home';


$(document).ready(function(){

	//FASTCLICK
	FastClick.attach(document.body);

	Core.hideLoadingView();
	Core.blockGlobalSideMenu();
	//SPLASH
	Core.fullScreen(true);
	Core.loadPageWithoutBack(sectionPage, 'splash', 'Splash');

	uuid_check();



});


function uuid_check(){

	var uuid = '0';
	if(window.device)
		uuid = window.device.uuid;

	console.log('UUID : ' + uuid);

	API.getData('/user/uuid_check', { uuid : uuid }, function(result){
		if(result.success){

			Core.clearBackList();
			Core.defineHomeView(sectionPage, 'index', 'Main View');
			Core.loadPage(sectionPage, 'index', 'Main View');
			Core.fullScreen(false);

		}else{

			setTimeout(function(){

				Core.loadPage(sectionPage, 'login','Login');

			},3000);

			Core.initGlobalSideMenu();
			Core.initBackButton();

		}
	}, function(){
		uuid_check();
	});

}
