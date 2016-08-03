'use strict';
var map;
var infoWindow;

// Display an error message if map fails to load
var googleMapError = function() {
	console.log('Failed to load Google Map. Please try again later.');
	alert('Failed to load Google Map. Please try again later.');
};

// Initiazlie map and set up ViewModel
var initMap = function(){
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.759, lng: -122.423},
		zoom: 16
	});
	// Use only one InfoWindow to keep max of one open at a time
	infoWindow = new google.maps.InfoWindow({
		content: null
	});
	ko.applyBindings(new ViewModel());
};

// Get information from NYTimes about each location
var NYTimes = function(location) {
	var nytURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + location.name() + '&sort=newest&api-key=3ee99f8f736242c18f89225585db60a4';
	$.getJSON(nytURL, function(data) {
		var nytElem = ('<h3>New York Times Articles About ' + location.name() + '</h3><ul>');
		var articles = data.response.docs;
		if (!articles) {
			nytElem += '<li class="error">Data not available</li>';
		}
		else {
			for (var i = 0; i < articles.length; i++) {
				var article = articles[i];
				nytElem += '<li class="article">' + '<a href="' + article.web_url + '" target="_blank">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>';
			}
		}
		infoWindow.setContent(nytElem);
	}).fail(function(e) {
		var nytElem = 'New York Times Articles Could Not Be Loaded';
		infoWindow.setContent(nytElem);
	});
};

// Locations on the map
var initialLocations = [
	{
		name: 'Dolores Park',
		lat: 37.7597727,
		lng: -122.427063
	},
	{
		name: 'Tartine Bakery',
		lat: 37.7614184,
		lng: -122.4241038
	},
	{
		name: 'Alamo Drafthouse Cinema',
		lat: 37.7562163,
		lng: -122.4191911
	},
	{
		name: 'Gracias Madre',
		lat: 37.7615715,
		lng: -122.4190799
	},
	{
		name: 'The Chapel',
		lat: 37.760565,
		lng: -122.421188
	}
];

// Knockout model for locations
// Also makes markers and InfoWindows
var Location = function(data) {
	var self = this;
	this.name = ko.observable(data.name);
	this.lat = data.lat;
	this.lng = data.lng;
	this.visible = ko.observable(true);
	this.marker = new google.maps.Marker({
		title: this.name(),
		position: {lat: this.lat, lng: this.lng},
		map: map
	});
	// Get info from NYTimes and display in InfoWindow
	this.showInfo = function() {
		NYTimes(self);
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
		infoWindow.open(map, self.marker);
		setTimeout(function() {
			self.marker.setAnimation(null);
		}, 700);
	};
	this.marker.addListener('click', function() {
		self.showInfo();
	});
};

// ViewModel for the application
var ViewModel = function() {
	// error handling
	if (typeof google !== 'object' || typeof google.maps !== 'object') {
		console.log("error loading Google Maps API");
		googleMapError();
	}
	var self = this;
	this.query = ko.observable('');
	this.locationList = ko.observableArray([]);
	initialLocations.forEach(function(locationItem) {
		self.locationList.push(new Location(locationItem));
	});
	// Run the marker's showInfo function if list item clicked
	this.showInfo = function() {
		this.showInfo();
	};
	this.search = function(value) {
		// clear the map
		self.locationList().forEach(function(location) {
			if(location.name().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				location.marker.setVisible(true);
				location.visible(true);
			}
			else {
				location.marker.setVisible(false);
				location.visible(false);
			}
		});
		// recreate list of locations based on search terms
		// initialLocations.forEach(function(location) {
		// 	if(initialLocations[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
		// 		self.locationList.push(new Location(initialLocations[i]));
		// 	}
		// });
	};
	// subscribe to updates to search
	this.query.subscribe(this.search);
};
