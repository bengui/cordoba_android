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

fb_handler.getLoginStatus = function(){
	FB.getLoginStatus(function(response) {
		if (response.status == 'connected') {
			console.log("[Logged In]")
		} else {
			console.log("[Not Logged In]")
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

fb_handler.login = function(){
	FB.login(
		function(response) {
			fb_handler.getLoginStatus();
		},
		{ scope: "email" }
		);
}

fb_handler.facebookWallPost = function(_method,_to,_name,_link,_picture,_caption,_description){
	/*
	var params = {
		method: _method,
		name: _name,
		link: _link,
		picture: _picture,
		caption: _caption,
		description: _description
	};
	*/
	var params = {
		method: 'feed',
		to: friendID.toString(),
		name: 'Facebook Dialogs',
		link: 'https://developers.facebook.com/docs/reference/dialogs/',
		picture: 'http://fbrell.com/f8.jpg',
		caption: 'Reference Documentation',
		description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
	};
	if (_to != null){
		//params.to = _to;
		params.to = "102223523315068";
	}
 	FB.ui(params, function(obj) { console.log(JSON.stringify(obj));});
}

document.addEventListener('deviceready', function() {
	try {
		alert('App Ready for Facebook Integration with App: 558034380901393');
		FB.init({ appId: "558034380901393", nativeInterface: CDV.FB, useCachedDialogs: false });
	} catch (e) {
		alert('Failed Facebook Integration');
		alert(e);
	}
}, false);