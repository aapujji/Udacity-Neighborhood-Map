clientID = 'P3XHFH4QAQCNQFKKECSLQSFXM5NU5KAPMOPRERBUZWSAVAD2';
clientSecret = 'L2HAYGAW1TQKCKDDFN0BAZH3W1RU2FPFSBH3XOAUEEEUVKHE';

var initialLocations = [
	{
		title: 'Leaf Bar and Lounge',
		lat: 40.759275,
		lng: -73.833208,
		id: '55cbc8b5498e38ec31fae302'
	},
	{
		title: 'The Coop',
		lat: 40.759071,
		lng: -73.832260,
		id: '556d3cb6498e57b628aaaae6'
	},
	{
		title: 'Pokewave',
		lat: 40.759457,
		lng: -73.831151,
		id: '57c8a9b2498ed1dcb9489520'
	},
	{
		title: 'Spot Dessert Bar',
		lat: 40.729364,
		lng: -73.988949,
		id: '585c91bc07ac076844eba90b'
	},
	{
		title: '520 Desserts',
		lat: 40.760849,
		lng: -73.833251,
		id: '571eb136498e824cc68782e0'
	},
	{
		title: 'Ke Zhang',
		lat: 40.750592,
		lng: -73.819368,
		id: '52019f6b498edfb499f84202'
	},
	{
		title: 'T-Swirl',
		lat: 40.760188,
		lng: -73.826566,
		id: '543882f2498e88f9b1051a3e'
	},
	{
		title: 'Lucias Pizza',
		lat: 40.760282,
		lng: -73.828168,
		id: '4b9beb47f964a520c53536e3'
	},
	{
		title: 'Teaus Sushi Burrito',
		lat: 40.754637,
		lng: -73.827695,
		id: '59482c2adb1d815a3bb0ea21'
	},
	{
		title: 'River',
		lat: 40.760929,
		lng: -73.831242,
		id: '514cc041e4b0f4bc3127b7d9'
	}
]

var map;
var markers = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.757733, lng: -73.828949},
		zoom: 15
	});

	for (var i = 0; i < initialLocations.length; i++) {
		var position = new google.maps.LatLng(initialLocations[i].lat,initialLocations[i].lng);
		var title = initialLocations[i].title;

		var marker = new google.maps.Marker({
			position: position,
			title: title,
			id: i
		});

		markers.push(marker);
	}

	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

var Location = function(data) {
	var self = this;
	this.title = data.title;
	this.lat = data.lat;
	this.lng = data.lng;
	this.id = data.id;
	this.category = '';
	this.website = '';
	this.street = '';
	this.city = '';
	this.rating = '';
	this.image = '';

	var fourSquare = 'https://api.foursquare.com/v2/venues/' + this.id + '?' + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180315';

	$.getJSON(fourSquare).done(function(data) {
		self.results = data.response.venue;

		self.title = results.name;
		self.category = results.categories[0].shortName;
		self.website = results.url;
		if (!results.url) {
			self.website = '';
		}
		self.street = results.location.formattedAddress[0];
		self.city = results.location.formattedAddress[1];
		self.rating = results.rating;
		if (!results.rating) {
			self.rating = 0;
		}
		// image = results.photos.groups[0].items[0].source.url + results.photos.groups[0].items[0].suffix;

		// console.log(results);
		// console.log(category);
		// console.log(self.website);
		// console.log(self.street);
		// console.log(self.city);
		// console.log(self.rating);
		// console.log(image);

	}).fail(function() {
		alert('There was an error loading the FourSquare API. Please try again later.');
	});
}

var ViewModel = function() {
	self = this;

	this.locationList = ko.observableArray([]);

	initialLocations.forEach(function(locItem) {
		self.locationList.push(new Location(locItem));
	})
}

function loadMap() {
	ko.applyBindings(new ViewModel());
}