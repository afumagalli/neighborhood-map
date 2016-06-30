var initialLocations = [
	{
		name: 'Dolores Park',
		lat: 37.7597727,
		lng: -122.427063,
		clicked: false
	},
	{
		name: 'Tartine Bakery',
		lat: 37.7614184,
		lng: -122.4241038,
		clicked: false
	},
	{
		name: 'Alamo Drafthouse Cinema',
		lat: 37.7562163,
		lng: -122.4191911,
		clicked: false
	},
	{
		name: 'Gracias Madre',
		lat: 37.7615715,
		lng: -122.4190799,
		clicked: false
	},
	{
		name: 'The Chapel',
		lat: 37.760565,
		lng: -122.421188,
		clicked: false
	}
];
var contentString = "This is a test of the InfoWindow";
var markers = [];
var infoWindows = [];
var map;

var Location = function(data) {
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.clicked = ko.observable(data.clicked);
}

window.initMap = function(){
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.759, lng: -122.423},
		zoom: 16
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
		console.log(markers[i]);
		markers[i].addListener('click', function() {
			infoWindows[i].open(map, markers[i]);
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
    initialLocations.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));
    });
    dropMarkers(this.locationList());
    this.currentLocation = ko.observable(this.locationList()[0]);
    this.setCurrentLocation = function(clickedLocation) {
        self.currentLocation(clickedLocation);
    };
    this.search = function(value) {
		// remove all the current beers, which removes them from the view
		self.locationList.removeAll();
		for(var x in initialLocations) {
			if(initialLocations[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				self.locationList.push(new Location(initialLocations[x]));
			}
		}
		dropMarkers(self.locationList());
	};
	this.query.subscribe(this.search);
};

ko.applyBindings(new ViewModel());
//ViewModel.query.subscribe(ViewModel.search);
