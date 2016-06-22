// define globals
var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
var $quakesList;
var map;
var template;

$(document).on("ready", function() {
	var source = $('#quakes-template').html();
	var template = Handlebars.compile(source);

	$.get(weekly_quakes_endpoint,function (data) {
		console.log(data);


		var quakeResults = data.features;
		console.log(quakeResults);

        quakeResults.forEach(function (value, index) {
            quakeResults[index].properties.time = timeSince(quakeResults[index].properties.time) + " ago.";
            if (quakeResults[index].properties.title.split("of ").length==1) {
                quakeResults[index].properties.title = quakeResults[index].properties.title.split("- ")[1];
            }
            else {
                quakeResults[index].properties.title = quakeResults[index].properties.title.split("of ")[1];
            }
        });



		// pass in data to render in the template
		var trackHtml = template({ quake: quakeResults });

		// append html to the view
		$("#info").append(trackHtml);



		map = new google.maps.Map(document.getElementById('map'), {
  			center: {lat: 39.76, lng: -105.01},
  			zoom: 1
		});

		quakeResults.forEach(function (value, index) {
			var myLatLng = {lat: quakeResults[index].geometry.coordinates[1], lng: quakeResults[index].geometry.coordinates[0]};
			var marker = new google.maps.Marker({
	  			position: myLatLng,
	  			map: map,
	  			title: quakeResults[index].properties.title
			});
		});

	});

});


function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        return interval + " year(s)";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + " month(s)";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + " day(s)";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + " hour(s)";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + " minute(s)";
    }
    return Math.floor(seconds) + " second(s)";
}
