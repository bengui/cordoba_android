
window.onload = function(){
	alert('onload');
	initialize();
};

initialize();

var height = $(window).height() - Core.data.navbarHeight;
$('#map').css('height', height + 'px');


function initialize() {
	console.log('initialize maps');

	var myLatlng = new google.maps.LatLng(-32.9667317, -60.6342906);

	var mapOptions = {
		center: myLatlng,
		zoom: 14,
		disableDefaultUI: true,
		zoomControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	var contentString = '<div id="content">'+
			'<div id="siteNotice">'+
				'</div>'+
					'<h1 id="firstHeading" class="firstHeading">Mi casa</h1>'+
					'<div id="bodyContent">'+
					'<p>Esta es mi casa</p>'+
					'<p>Yo soy bengui</p>'+
				'</div>'+
			'</div>'+
		'</div>';
	
	
	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});

	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title: 'Mi casa'
	});

	google.maps.event.addListener(marker, 'click', function() {
		//infowindow.open(map,marker);
		infowindow.open(map, this);
    	map.panTo(myLatlng);
	});
}