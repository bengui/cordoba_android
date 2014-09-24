$(document).ready(function(){

	Core.addLink('link_gallery-home', 'gallery', 'home');
	$('#fullscreenON').click(function(){
		Core.fullScreen(true);
	});
	$('#fullscreenOFF').click(function(){
		Core.fullScreen(false);
	});
	$('#activityIndicatorON').click(function(){
		Core.activityIndicator(true);
	});
	$('#loading').click(function(){
		Core.activityIndicator(false);
	});

});