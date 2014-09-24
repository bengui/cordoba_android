

var API = (function(){

	var cache = [];
	var cacheLifeTime = 15; //Expresed in minutes
	var retryAttempts = 3;
	var retryTime = 0;
	var timeout = 8000; //Expresed in milisecons
	var enableCache = false;

	findInCache = function(url){

		var now;
		var diff;

		for (var i = 0; i < cache.length; i++) {
			if(cache[i].url == url){
				now = new Date();
				diff = (now.getTime() - cache[i].date.getTime()) / (1000 * 60);
				
				console.log('API - getData - CACHE - time difference : ' + diff);

				if( diff < cacheLifeTime ){
					return cache[i];
				}else{
					//HACER UN POP DEL CACHE, YA QUE NO SIRVE MAS
					//VER COMO IR LIMPIANDO EL CACHE CADA TANTO
					cache.splice(i,1); //Quita un elemento a partir del indice i
				}
			}
		}
		return false;
	}


	function convertParamsToUrl(data){
		var result = '?';
		var first = true;
		for (var i in data) { 
			if(first){
				result +=  i + '=' + data[i];
				first = false; 
			}else{
				result += '&' + i + '=' + data[i]; 
			}
		} 
		return result; 
	}


	makeAjaxCall = function(url, useCache, data, success_function, error_function){
		console.log('API - getData - ' + url);
		retryTime++;
		console.log('API - getData - retryTime - ' + retryTime);

		Core.showLoadingView();

		var cachedData;
		var type;
		var dataType;

		if(useCache){
			cachedData = findInCache(url);

		}else{
			cachedData = false;

		}

		if(cachedData){

			console.log('API - getData - USE CACHE - ' + url);
			Core.hideLoadingView();
			success_function(cachedData.response);

		}else{

			/*
			if(!$.isEmptyObject(data)){
				url = url + convertParamsToUrl(data);
			}
			*/

			$.ajax({
				dataType	: 'json',
				type 		: 'GET',
				timeout 	: timeout,
				data 		: data,
				url 		: Core.data.serverUrl + url,
				success 	: success,
				error       : error
			});	

			function success(response){
				console.log('API - getData - SUCCESS -' + url);
				Core.hideLoadingView();
				console.log(JSON.stringify(response));
				if(typeof success_function == 'function'){
					success_function(response);
				}
				cache.push({
					url 		: url,
					response 	: response,
					date 		: new Date()
				});
			}	

			function error(xhr,status,error){
				if( retryTime >= retryAttempts){
					Core.hideLoadingView();
					console.log('API - getData - ERROR - ' + Core.data.serverUrl + url);
					console.log('API - getData - ERROR - ' + error);
					if(typeof error_function == 'function'){
						error_function();
					}
				}else{
					makeAjaxCall(url, false, data, success_function, error_function);
				}
			}

		}
	}

	makeAjaxPush = function(url, data, success_function, error_function){
		console.log('API - pushData - ' + url);
		retryTime++;
		console.log('API - pushData - retryTime - ' + retryTime);

		Core.showLoadingView();

		$.ajax({
				dataType	: 'json', //TODO : VERIFICAR EL FUNCIONAMIENTO DEL POST
				type 		: 'POST',
				timeout 	: timeout,
				data 		: data,
				url 		: Core.data.serverUrl + url,
				success 	: success,
				error: error
			});	

		function success(response){
			console.log('API - pushData - SUCCESS -' + url);
			Core.hideLoadingView();
			console.log(JSON.stringify(response));
			if(typeof success_function == 'function'){
				success_function(response);
			}

		}	

		function error(xhr,status,error){
			if( retryTime >= retryAttempts){
				Core.hideLoadingView();
				console.log('API - pushData - ERROR - ' + url);
				console.log('API - pushData - ERROR - ' + error);
				if(typeof error_function == 'function'){
					error_function();
				}
			}else{

				makeAjaxPush(url, data, success_function, error_function);
			}
		}


	}





	return{
		//public methods
		getData: function(url, param1, param2, param3){
			retryTime = 0;
			switch(arguments.length){
				case 2:
				makeAjaxCall(url, enableCache, {}, param1);
				case 3:
				makeAjaxCall(url, enableCache, param1, param2);
				break;
				case 4:
				makeAjaxCall(url, enableCache, param1, param2, param3);
				break;
				default:
				return false;
				break;
			}
			
			
		},

		postData: function(url, data, success, error){
			makeAjaxPush(url, data, success, error);
		},

		getDataWithoutCache: function(url, data, callback){
			retryTime = 0;
			makeAjaxCall(url, false, callback);
		},

		flushCache: function(){
			cache = [];
			console.log('API - flushCache');
		}

	}


})();