// Array of locations
var initialLocations = [
	{
		title: 'Leaf Bar and Lounge',
		location: {
			lat: 40.759275,
			lng: -73.833208
		},
		id: '55cbc8b5498e38ec31fae302'
	},
	{
		title: 'The Coop',
		location: {
			lat: 40.759071,
			lng: -73.832260
		},
		id: '556d3cb6498e57b628aaaae6'
	},
	{
		title: 'Pokewave',
		location: {
			lat: 40.759457,
			lng: -73.831151
		},
		id: '57c8a9b2498ed1dcb9489520'
	},
	{
		title: 'Spot Dessert Bar',
		location: {
			lat: 40.759251,
			lng: -73.832192
		},
		id: '585c91bc07ac076844eba90b'
	},
	{
		title: '520 Desserts',
		location: {
			lat: 40.760849,
			lng: -73.833251
		},
		id: '571eb136498e824cc68782e0'
	},
	{
		title: 'Ke Zhang',
		location: {
			lat: 40.750592,
			lng: -73.819368
		},
		id: '52019f6b498edfb499f84202'
	},
	{
		title: 'T-Swirl',
		location: {
			lat: 40.760188,
			lng: -73.826566
		},
		id: '543882f2498e88f9b1051a3e'
	},
	{
		title: 'Lucias Pizza',
		location: {
			lat: 40.760282,
			lng: -73.828168
		},
		id: '4b9beb47f964a520c53536e3'
	},
	{
		title: 'Teaus Sushi Burrito',
		location: {
			lat: 40.754637,
			lng: -73.827695
		},
		id: '59482c2adb1d815a3bb0ea21'
	},
	{
		title: 'River',
		location: {
			lat: 40.760929,
			lng: -73.831242
		},
		id: '514cc041e4b0f4bc3127b7d9'
	}
]

// Initialize global variables for later use
var map;
var infoWindow;
var infoWindowContent;
var markers = [];

// Initializes the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.757733, lng: -73.828949},
		zoom: 15
	});

	infoWindow = new google.maps.InfoWindow();

	ko.applyBindings(new ViewModel());
}

var Location = function(data) {
	var self = this;

	this.title = data.title;
	this.location = data.location;
	this.id = data.id;
	this.category = '';
	this.street = '';
	this.city = '';

	this.visible = ko.observable(true);

	// Setup foursquare API
	clientID = 'K3WBLEHA15Z2BS0V0ZPR5LWQDA0HFOHWELW3A3VL5SHXITA4';
	clientSecret = 'UQFA50CAD5JGY2XXVL1BG4A4P4RUXLWKWETS1T2ZSTPVSMG2';

	var fourSquare = 'https://api.foursquare.com/v2/venues/' + this.id + '?' + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180322';

	// Retrieve data about locations from foursquare API
	$.getJSON(fourSquare).done(function(data) {
		var results = data.response.venue;

		self.category = results.categories[0].shortName;
		self.street = results.location.formattedAddress[0];
		self.city = results.location.formattedAddress[1];

		// console.log(results);
		// console.log(self.category);
		// console.log(self.street);
		// console.log(self.city);

	}).fail(function() {
		alert('There was an error loading the FourSquare API. Please try again later.');
	});

	// Create markers for each location
	this.marker = new google.maps.Marker({
		position: this.location,
		title: this.title,
		animation: google.maps.Animation.DROP
	});

	// Show or hide markers based on filters
	self.filterMarkers = ko.computed(function() {
		if (self.visible() === true) {
			self.marker.setMap(map);
		} 
		else {
			self.marker.setMap(null);
		}
	});

	self.marker.setMap(map);

	// Display infowindow and add animation for markers when clicked
	this.marker.addListener('click', function() {
		infoWindowContent = '<div class="info-window"><div class="title"><h5>' + this.title + '</h5><p class="category">' + self.category + '</p></div>' + 
		'<div class="address"><p>' + self.street + '<p><p>' + self.city + '</p></div></div>';
		populateInfoWindow(this, infoWindow, infoWindowContent);
		map.panTo(this.getPosition());
		toggleBounce(this);
	});

	// Function to show infowindow when locations in list are clicked
	this.show = function(location) {
		google.maps.event.trigger(self.marker, 'click');
	}
}

var ViewModel = function() {
	self = this;

	this.searchTerm = ko.observable('');

	this.locationList = ko.observableArray([]);

	initialLocations.forEach(function(locItem) {
		self.locationList.push(new Location(locItem));
	});

	// Generate list of locations based on characters entered in search field
	this.searchList = ko.computed(function() {
		var filter = self.searchTerm().toLowerCase();
		if (filter) {
			return ko.utils.arrayFilter(self.locationList(), function(location) {
				var str = location.title.toLowerCase();
				var result = str.includes(filter);
				location.visible(result);
				return result;
			});
		}
		self.locationList().forEach(function(location) {
			location.visible(true);
		});
		return self.locationList();
	}, self);
}

// Function to populate infowindow
function populateInfoWindow(marker, infowindow, content) {
	// Make sure infowindow is not already open for this marker
	if (infowindow.marker != marker) {
		// Clear infowindow content
		infowindow.setContent('');
		infowindow.marker = marker;

		// Set marker to null if infowindow is closed
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});

		infowindow.setContent(content);

		infowindow.open(map, marker);
	}
}

// Function to toggle bounce animation when markers/locations in list are clicked
function toggleBounce(marker) {
	if (marker.getAnimation() != null) {
		marker.setAnimation(null);
	}
	else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			marker.setAnimation(null);
		}, 700);
	}
}
