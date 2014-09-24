document.addEventListener("deviceready", function(){
	
	$('#fb-login').click(function(){
		fb_handler.login();
	});

	$('#fb-me').click(function(){
		fb_handler.friendList();	
	});

	$('#fb-getLogin').click(function(){
		fb_handler.getLoginStatus();	
	});

	$('#fb-logOut').click(function(){
		fb_handler.logout();	
	});

	$('#fb-wallPost').click(function(){
		fb_handler.wallPost("asd",null,"asd","asd","asd","asd","asd")
	});

	$('#fb-friendWallPost').click(function(){
		fb_handler.wallPost("asd","asd","asd","asd","asd","asd","asd")
	});
});