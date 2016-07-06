var map;
initMap = function(){
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
		lng: -122.427063,
		content: "This is a test of the InfoWindow"
	},
	{
		name: 'Tartine Bakery',
		lat: 37.7614184,
		lng: -122.4241038,
		content: "This is a test of the InfoWindow"
	},
	{
		name: 'Alamo Drafthouse Cinema',
		lat: 37.7562163,
		lng: -122.4191911,
		content: "This is a test of the InfoWindow"
	},
	{
		name: 'Gracias Madre',
		lat: 37.7615715,
		lng: -122.4190799,
		content: "This is a test of the InfoWindow"
	},
	{
		name: 'The Chapel',
		lat: 37.760565,
		lng: -122.421188,
		content: "This is a test of the InfoWindow"
	}
];

var Location = function(data) {
	var self = this;
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.content = ko.observable(data.content);
	this.marker = new google.maps.Marker({
		title: this.name(),
		position: {lat: this.lat(), lng: this.lng()},
		map: map
	});
	this.infoWindow = new google.maps.InfoWindow({
		content: this.content()
	});
	this.showInfo = function() {
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
		self.infoWindow.open(map, self.marker);
		setTimeout(function() {
			self.marker.setAnimation(null);
		}, 750);
	}
	this.marker.addListener('click', function() {
		self.showInfo();
	});
}

var ViewModel = function() {
	var self = this;
	this.query = ko.observable('')
	this.locationList = ko.observableArray([]);
	if (typeof google !== 'object' || typeof google.maps !== 'object') {
		console.log("error loading Google Maps API");
		return;
	};
	initialLocations.forEach(function(locationItem) {
		self.locationList.push(new Location(locationItem));
	});
	this.showInfo = function() {
		this.showInfo();
	};
	this.currentLocation = ko.observable(this.locationList()[0]);
	this.setCurrentLocation = function(clickedLocation) {
		self.currentLocation(clickedLocation);
	};
	this.search = function(value) {
		for(var x in self.locationList()) {
			google.maps.event.clearInstanceListeners(self.locationList()[x].marker)
			self.locationList()[x].marker.setMap(null);
		}
		self.locationList.removeAll();
		for(var x in initialLocations) {
			if(initialLocations[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				self.locationList.push(new Location(initialLocations[x]));
			}
		}
	};
	this.query.subscribe(this.search);
};
