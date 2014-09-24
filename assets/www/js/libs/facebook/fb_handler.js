/*
	FACEBOOK HANDLER - JAVASCRIPT PHONEGAP
	2013
*/

if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Verificar que se incluyo cordova.js');
if (typeof CDV == 'undefined') alert('CDV variable no existe. Verificar que se incluyo cdv-plugin-fb-connect.js');
if (typeof FB == 'undefined') alert('FB variable no existe. Verificar que se incluyo Facebook_js_SDK.js');

FB.Event.subscribe('auth.login', function(response) {
	//alert('auth.login event');
});

FB.Event.subscribe('auth.logout', function(response) {
	//alert('auth.logout event');
});

FB.Event.subscribe('auth.sessionChange', function(response) {
	//alert('auth.sessionChange event');
});

FB.Event.subscribe('auth.statusChange', function(response) {
	//alert('auth.statusChange event');
});

var fb_handler = {};

fb_handler.getLoginStatus = function(success, error){
	FB.getLoginStatus(function(response) {
		if (response.status == 'connected') {
			console.log("[Logged In]");
			success();
		} else {
			console.log("[Not Logged In]");
			if (error){
				error();
			}
		}
	});
}

fb_handler.friendList = function() {
	FB.api('/me/friends', { fields: 'id, name, picture' },  function(response) {
		if (response.error) {
			alert(JSON.stringify(response.error));
		} else {
			response.data.forEach(function(item) {
				console.log("[Img: "+ JSON.stringify(item.picture) +"] - [ID: "+ item.id +"] - [Name: "+ item.name +"]");
			});
		}
	});
}

fb_handler.logout = function(){
	FB.logout(function(response) {
		console.log("[Successfuly Logged Out]")
	});
}

fb_handler.login = function(callback){
	FB.login(
		function(response) {
			fb_handler.getLoginStatus(callback ,function(){
				alert("Failed Login");
			});
		}, { scope: "email" }
	);
}

/*
fb_handler.facebookWallPost = function(_method,_to,_name,_link,_picture,_caption,_description){
	if(fb_handler.getLoginStatus()){
		var params = {
			method: _method,
			name: _name,
			link: _link,
			picture: _picture,
			caption: _caption,
			description: _description
		};
		if (_to != null){
			params.to = _to;
		}
	 	FB.ui(params, function(obj) { console.log(JSON.stringify(obj));});
	} else {
		fb_handler.login(this);
	}
}
*/

fb_handler.facebookWallPost = function(_method,_to,_name,_link,_picture,_caption,_description){
	fb_handler.getLoginStatus(
		function(){
			var params = {
				method: _method,
				name: _name,
				link: _link,
				picture: _picture,
				caption: _caption,
				description: _description
			};
			if (_to != null){
				params.to = _to;
			}
		 	FB.ui(params, function(obj) { console.log(JSON.stringify(obj));});
		}, 
		function(){
			fb_handler.login(function(){
				fb_handler.facebookWallPost(_method,_to,_name,_link,_picture,_caption,_description);
			});
		}
	);
}

document.addEventListener('deviceready', function() {
	try {
		//alert('App Ready for Facebook Integration with App: 558034380901393');
		FB.init({ appId: "558034380901393", nativeInterface: CDV.FB, useCachedDialogs: false });
	} catch (e) {
		alert('Failed Facebook Integration');
		alert(e);
	}
}, false);