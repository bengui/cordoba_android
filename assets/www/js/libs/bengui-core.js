/*


	BENGUI CORE - JAVASCRIPT CORDOVA
	2013

	This core requires jquery!



*/


document.addEventListener('deviceready', onDeviceReady, false);

//Phonegap Events Binds
function onDeviceReady() {
    document.addEventListener('backbutton', Core.popBackStack, false);
    document.addEventListener('menubutton', Core.toggleSideMenu, false);

}

$(document).ready(function(){
	Core.init();

});

var Core = (function(){

	//PRIVATE VARIABLES
	var data = {};
	var element = {};
	
	var efect = 'toggle';


	//PRIVATE METHODS
	var hello = function(){
		console.log('hello wolrd');
	};


	return{
		//PUBLIC VARIABLES

		data : data,

		element : element,

		//PUBLIC METHODS

		init : function(){	

			hello();

			Core.hideNavBarIconExtra();

			data.actualPage = null;
			data.actualSection = null;
			data.actualTitle = null;
			data.actualPageData = null;
			data.homePage = null;
			data.homeSection = null;
			data.homeTitle = null;
			data.backList = [];
			data.modalWindowOpen = false;
			data.blockGlobalSideMenu = false;


		    element.navbarIconMenu = $('#global-navbar-icon-menu');
			element.sideMenu = $('#global-side-menu');
			element.navbarTitle = $('#global-navbar-title');
			element.navbar = $('#global-navbar');
			element.indexContainer = $('#index-container');
			element.navbarIconBack = $('#global-navbar-icon-back');
			element.navbarElementList = $('#navbar-elements li');
			element.sideMenuElementList = $('#global-side-menu ul li');
			element.loadingView = $('#loading-view');
			element.okOnlyModalContainer = $('#ok-only-modal-container');
			element.okOnlyModalMessage = $('#ok-only-modal-message');
			element.okOnlyModalButton = $('#ok-only-modal-btn');


			
			Core.initOkOnlyModal();

		},
		//Inicia el menú global
		initGlobalSideMenu : function(){


			Core.closeGlobalSideMenu();
			
			element.navbarIconMenu.click(function(){
				
				Core.toggleSideMenu();
				
			});

			element.sideMenuElementList.each(function () {
				if(this.id.substr(0, 5) == 'link_'){
					var section = this.id.substr(5, this.id.length);
					$('#' + this.id).click(function(){
						// VALIDA SI ESTAS EN LA MISMA SECCION - DESHABILITADO
						//if(data.actualSection != section){

							element.navbarTitle.text($(this).text());
							console.log($(this).text());
							Core.loadPage(section, 'index', $(this).text());
							
						//}
						Core.closeGlobalSideMenu();
					});
				}
			});

		},

		//Cierra el Menú
		closeGlobalSideMenu : function(){
			element.sideMenu.hide();
		},

		//Abre el Menú
		openGlobalSideMenu : function(){
			if(!data.blockGlobalSideMenu){
				element.sideMenu.show();
			}
		},

		//Bloquea el Menú
		blockGlobalSideMenu: function(){
			data.blockGlobalSideMenu = true;
		},

		//Desbloquea el Menú
		unblockGlobalSideMenu: function(){
			data.blockGlobalSideMenu = false;
		},

		//
		toggleSideMenu : function(){
			if(element.sideMenu.is(':visible')){
				Core.closeGlobalSideMenu();
			}else{
				Core.openGlobalSideMenu();		
			}
		},

		//Carga una vista
		loadPage : function(section, page, param1, param2){

			data.modalWindowOpen = false;

			Core.hideLoadingView();
			Core.hideNavBarIconExtra();
			
			data.actualPage = page;
			data.actualSection = section;

			var title = null;
			var pageData = null;

			if(typeof param1 === 'string'){
				title = param1;
				data.actualTitle = title;
				element.navbarTitle.text(title);

				if(typeof param2 === 'object'){
					pageData = param2;
				}

			}else if(typeof param1 === 'object'){
					pageData = param1;
			}

			Core.data.actualPageData = pageData;

			Core.addToBackList(section, page, data.actualTitle, Core.data.actualPageData);

			if(efect=='toggle'){

				element.indexContainer.children().fadeToggle(250, "linear",function(){
					element.indexContainer.load('pages/' + section + '/' + page + '.html').hide();
					$(this).remove();
					element.indexContainer.show(250);
				});

			}
			if(efect == '' || efect == 'default'){
				element.indexContainer.load('pages/' + section + '/' + page + '.html');
			}
			
			$('body').scrollTop(0);

		},

		//Carga pagina sin agregarla en la BackList
		loadPageWithoutBack : function(section, page, title, pageData){

			Core.hideLoadingView();
			Core.hideNavBarIconExtra();

			data.actualPage = page;
			data.actualSection = section;
			element.navbarTitle.text(title);
			data.actualPageData = pageData;

			element.indexContainer.load('pages/' + section + '/' + page + '.html');

			$('body').scrollTop(0);
		},


		addLink : function(link_id, section, page){

			$('#' + link_id).click(function(){
				Core.loadPage(section, page);
			});

		},

		addNavBarLink : function(link_id, section){

			$('#' + link_id).click(function(){
				Core.loadPage(section, 'index');
				element.navbarElementList.each(function (index) {
					$(this).removeClass('active');
				});
				$('#' + target_id).addClass('active');
			});

		},


		initNavBarLinks : function(){
			element.navbarElementList.each(function (index) {
					$(this).removeClass('active');

				});
		},

		//Agrega vista a la BackList
		addToBackList : function(section, page, title, pageData){

			var view = {
				section : section,
				page : page,
				title : title,
				pageData : pageData
			}
			data.backList.push(view);

		},

		//Limpia la BackList
		clearBackList : function(){

			data.backList = [];

		},

		//Quita vista de la BackList
		popBackStack : function(){
			if(element.sideMenu.is(':visible')){
				Core.closeGlobalSideMenu();
			}else if(data.modalWindowOpen){
				Core.hideModalWindow();
			}else{

				Core.hideNavBarIconExtra();

				data.backList.pop();	

				if(data.backList.length > 0){


						var view = data.backList[data.backList.length - 1];

						/*
						if(data.actualSection == view.section && data.actualPage == view.page){
							if(data.backList.length > 0){
								view = data.backList.pop();
							}else{
								Core.goHomePage();
							}
						}
						*/

						Core.loadPageWithoutBack(view.section, view.page, view.title, view.pageData);

				}else{
					Core.goHomePage();
				}
			}
		},

		//Redirige a la Home
		goHomePage : function(){
			if(data.homeSection != null && data.homePage != null){
				element.navbarTitle.text(data.homeTitle);
				Core.loadPageWithoutBack(data.homeSection, data.homePage);
			}else{
				console.log('ERROR : no home section defined!');
			}
		},

		//Inicia boton para retroceder
		initBackButton : function(){
			element.navbarIconBack.click(function(){
				Core.popBackStack();
			});
		},

		//Define la vista que va a ser el Home
		defineHomeView : function(section, page, title){
			data.homePage = page;
			data.homeSection = section;
			data.homeTitle = title;
		},

		//Aplica Full Screen
		fullScreen : function(value){
			if(value){
				element.sideMenu.hide();
				element.navbar.hide();
				/*element.indexContainer.css('margin-top', '10px');*/
				element.indexContainer.addClass('index-container-fullscreen');
			}else{
				element.navbar.show();
				/*element.indexContainer.css('margin-top', '110px');*/
				element.indexContainer.removeClass('index-container-fullscreen');
			}
		},

		//Inicia ventanas modal
		initModalWindow: function(){

			data.modalWindowOpen = false;

			$('.modal-container').hide();

			$('.modal-window').click(function(){
				event.stopPropagation();
			});

			$('.modal-container').click(function(){
				Core.hideModalWindow();
			});
		},

		//Levanta ventana modal
		showModalWindow : function(modal_id){

			var height = $(window).height() - element.navbar.height();
			element.indexContainer.height(height);
			element.indexContainer.addClass('overflow-hidden');
			data.modalWindowOpen = true;
			if(modal_id){
				$('#' + modal_id).show();
			}else{
				$('.modal-container').show();
			}
		},

		//Oculta ventana modal
		hideModalWindow : function(modal_id){
			data.modalWindowOpen = false;
			element.indexContainer.height('100%');
			element.indexContainer.removeClass('overflow-hidden');

			if(modal_id){
				$('#' + modal_id).hide();
			}else{
				$('.modal-container').hide();
			}
			
		},

		//Muestra loader de carga
		showLoadingView : function(){
			var height = $(window).height() - element.navbar.height();
			element.indexContainer.height(height);
			element.indexContainer.addClass('overflow-hidden');

			element.loadingView.show();
		},

		//Oculta loader de carga
		hideLoadingView : function(){
			element.indexContainer.height('100%');		
			element.loadingView.hide();
			element.indexContainer.removeClass('overflow-hidden');
		},
		
		//Muestra icono extra en la nabvar, ejemplo boton de busqueda
		showNavBarIconExtra: function(){
			$('#global-navbar-icon-extra').show();
		},

		//Muestra icono extra en la nabvar
		hideNavBarIconExtra: function(){
			$('#global-navbar-icon-extra').hide();
		},

		//Aplica funcionalidad a icono extra de la nabvar
		bindNavBarIconExtra: function(action){
			$('#global-navbar-icon-extra').unbind('click');
			$('#global-navbar-icon-extra').click(action);
		},

		setNavBarActionIconExtra: function(src){
			$('#global-navbar-icon-extra img').attr('src', src);
		},

		//Aplica efecto de carga de imagenes
		placeHolderReplace: function(img_src,img_id){
			var img = new Image();
			$(img).attr({ src: img_src });
			$(img).load(function(){
				$('#'+img_id).css('opacity', '0.0').attr({ src: img_src }).animate( { opacity: 1.0 }, 1000 );
			});
		},

		//Inicia ventana modal de aviso con boton ok
		initOkOnlyModal: function(){
			element.okOnlyModalContainer.hide();
			element.okOnlyModalButton.click(Core.hideOkOnlyModal);
		},

		//Muestra ventana modal de aviso con boton ok
		showOkOnlyModal: function(message){

			if(message){
				element.okOnlyModalMessage.text(message);
				element.okOnlyModalContainer.show();
			}

		},

		//Oculta ventana modal de aviso con boton ok
		hideOkOnlyModal: function(){
			element.okOnlyModalMessage.text('');
			element.okOnlyModalContainer.hide();
		}




		

		

	};



})();







/*

	UTILS
	2013


*/

var Utils = (function(){

	
	return{
		
	}

}());







/*

	UI
	2013


*/

var UI = (function(){


	return{


	}



}());

