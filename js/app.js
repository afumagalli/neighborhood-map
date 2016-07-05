var map;
window.initMap = function(){
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.759, lng: -122.423},
		zoom: 16
	});
	ko.applyBindings(new ViewModel());
};

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
var contentString = "This is a test of the InfoWindow";
var markers = [];
var infoWindows = [];

var Location = function(data) {
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.marker = new google.maps.Marker({
		title: this.name(),
		position: {lat: this.lat(), lng: this.lng()},
		map: map
	});
}

function dropMarkers(locations) {
	clearMarkers();
	console.log(locations);
	for (var i = 0; i < locations.length; i++) {
		addMarkerWithTimeout(locations[i], 50, i);
	};
}

function addMarkerWithTimeout(position, timeout, i) {
	window.setTimeout(function() {
		markers.push(new google.maps.Marker({
			title: position.name(),
			position: {lat: position.lat(), lng: position.lng()},
			map: map,
			//animation: google.maps.Animation.DROP
		}));
		infoWindows.push(new google.maps.InfoWindow({
			content: contentString
		}));
		markers[i].addListener('click', function() {
			markers[i].setAnimation(google.maps.Animation.BOUNCE);
			infoWindows[i].open(map, markers[i]);
			setTimeout(function() {
				markers[i].setAnimation(null);
			}, 750);
		});
	}, timeout);
}

function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		google.maps.event.clearInstanceListeners(markers[i])
		markers[i].setMap(null);
	};
	markers = [];
	infoWindows = [];
}

var ViewModel = function() {
	var self = this;
	this.query = ko.observable('')
	this.locationList = ko.observableArray([]);
	sessionStorage.clear();
	if (typeof google !== 'object' || typeof google.maps !== 'object') {
		console.log("error loading Google Maps API");
		return;
	};
	initialLocations.forEach(function(locationItem) {
		self.locationList.push(new Location(locationItem));
	});
	//dropMarkers(this.locationList());
	this.bounceMarker = function() {

	};
	this.currentLocation = ko.observable(this.locationList()[0]);
	this.setCurrentLocation = function(clickedLocation) {
		self.currentLocation(clickedLocation);
	};
	this.search = function(value) {
		console.log(self.locationList());
		for(var x in self.locationList()) {
			google.maps.event.clearInstanceListeners(self.locationList()[x].marker)
			self.locationList()[x].marker.setMap(null);
		}
		self.locationList.removeAll();
		console.log(self.locationList());
		for(var x in initialLocations) {
			if(initialLocations[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				self.locationList.push(new Location(initialLocations[x]));
				console.log(self.locationList());
			}
		}
	};
	this.query.subscribe(this.search);
};

// $(function() {
// 	ko.applyBindings(new ViewModel());
// });
//ViewModel.query.subscribe(ViewModel.search);
