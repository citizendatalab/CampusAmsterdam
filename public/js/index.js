L.mapbox.accessToken = 'pk.eyJ1Ijoid291dGVybWUiLCJhIjoiMEhDeEx4OCJ9.3gsMweYcZWvuNHRaed2X8Q';

var geoJsonData;
var firstLoad = true;
var map = L.map('map', {
    center: [52.368257, 4.896212],
    zoom: 13
});

map.scrollWheelZoom.disable();
// Add tiles from Mapbox Style API (https://www.mapbox.com/developers/api/styles/)
L.tileLayer(
    'https://api.mapbox.com/styles/v1/wouterme/cj43v70co6hal2snuv39b4xxl/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
        tileSize: 256,
        attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
	
var smallIcon = new L.Icon({
    iconUrl: '../img/marker.png',
    
    iconSize:    [24, 39],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
  });

filterGeoJson('all');



function filterGeoJson(filterId){
	$.getJSON( "data/amsterdam_academy.json", function( data ) {
		geoJsonData =L.geoJson(data, {
			style: function (feature) {
				return {color: feature.properties.color};
			},
			pointToLayer: function(feature, latlng) {
		        return L.marker(latlng, {
		          icon: smallIcon
		        });
		      },
		    filter: function(feature, layer) {
		    	if(filterId === 'all'){
		    		return true
		    	}
		    	else if (feature.properties.type === filterId){
		    		return true
		    	}
		    },
			onEachFeature: function (feature, layer) {
				//layer.bindPopup(feature.properties.name);
				layer.on('click', function(e) {

					var contentTitle = 	$('.message-window-title');	
						contentTitle.html('<h3>'+feature.properties.name+'</h3>')

						$('.primFocusText').html(feature.properties.primFocus);
						$('.typeText').html(feature.properties.type);
						$('.keyPartnersText').html(feature.properties.keyPartners);

						if(feature.properties.contactPerson !== ''){
							$('.contactText').html('Contact: '+feature.properties.contactPerson);
						}else{
							$('.contactText').empty()
						}

						if(feature.properties.website !== ''){
							$('.websiteText').html("Website: <a href='"+feature.properties.website+"' target='blank'>"+feature.properties.website+"</a>");
						}else{
							$('.websiteText').empty()
						}
						
						

						if(feature.properties.photoUrl !== ''){
							$('.imgContainer').html("<img class='locationPhoto' src='img/images/"+feature.properties.photoUrl+"'/>");
						}else{
							$('.imgContainer').empty();
						}
						

					var hidden = $('.message-window');
						if ( $(window).width() < 800) {      
						  hidden.animate({"left":"0%"}, "slow").addClass('visible');
						} 
						else {
						  hidden.animate({"left":"60%"}, "slow").addClass('visible');
						}
						
				});
			}
		})
		geoJsonData.addTo(map)
		if(firstLoad == true){
			map.fitBounds(geoJsonData.getBounds());
			firstLoad = false;
		}

	});

}


function closeMessageWindow(){
	var hidden = $('.message-window');
	hidden.animate({"left":"100%"}, "slow").addClass('visible');
}

$(document).ready(function(){
	$('.message-window-close').click(function(){
		closeMessageWindow()
	});

	$('.filterList li').click(function(){
		closeMessageWindow()
		map.removeLayer( geoJsonData );
		filterId = this.id;
		if($(this).hasClass('active')){
			$('.filterList li').removeClass('active');
			filterId = 'all'
		}else{
			$('.filterList li').removeClass('active');
			$(this).addClass('active')
		}
		filterGeoJson(filterId)
	});
});

