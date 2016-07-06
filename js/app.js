var map;
initMap = function(){
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.759, lng: -122.423},
		zoom: 16
	});
	ko.applyBindings(new ViewModel());
};

var NYTimes = function(location) {
	var nytElem = null;
	var nytURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + location.name() + '&sort=newest&api-key=3ee99f8f736242c18f89225585db60a4';
	$.getJSON(nytURL, function(data) {
		var nytElem = ('<h3>New York Times Articles About ' + location.name() + '</h3><ul>');
		articles = data.response.docs;
		for (var i = 0; i < 1; i++) {
			var article = articles[i];
			nytElem += '<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>';;
		};
		location.infoWindow.setContent(nytElem);
	}).fail(function(e) {
		nytElem = 'New York Times Articles Could Not Be Loaded';
		location.infoWindow.setContent(nytElem);
	});
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


var Location = function(data) {
	var self = this;
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.marker = new google.maps.Marker({
		title: this.name(),
		position: {lat: this.lat(), lng: this.lng()},
		map: map
	});
	this.infoWindow = new google.maps.InfoWindow({
		content: null
	});
	NYTimes(this);
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
	if (typeof google !== 'object' || typeof google.maps !== 'object') {
		console.log("error loading Google Maps API");
		return;
	};
	this.query = ko.observable('')
	this.locationList = ko.observableArray([]);
	initialLocations.forEach(function(locationItem) {
		self.locationList.push(new Location(locationItem));
	});
	this.showInfo = function() {
		this.showInfo();
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
