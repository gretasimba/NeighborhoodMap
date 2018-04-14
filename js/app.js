"use strict";

var initialMuseums = [
    {
        name: "Museum of the City of New York",
        lat: 40.792498,
        lng: -73.9540977,
        url: "http://mcny.org"
    },
    {
        name: "The Metropolitan Museum of Art",
        lat: 40.7791655,
        lng: -73.9629278,
		url: "http://metmuseum.org"
    },
    {
        name: "The Museum of Modern Art",
        lat: 40.7613258,
        lng: -73.9847444,
        url: "http://moma.org"
    },
    {
        name: "American Museum of Natural History",
        lat: 40.7809345,
        lng:  -73.9737497,
        url: "http://amnh.org"
    },
    {
        name: "Whitney Museum of American Art",
        lat: 40.7396059,
        lng: -74.0089716,
        url: "http://whitney.org"
    },
    {
        name: "New Museum",
        lat: 40.7224101,
        lng: -73.992874,
        url: "http://newmuseum.org "
    },
    {
        name: "The Frick Collection",
        lat: 40.771209,
        lng: -73.96739909999999,
        url: "http://frick.org"
    },
    {
        name: "Intrepid Sea, Air & Space Museum",
        lat: 40.7645266,
        lng: -73.99960759999999,
        url: "http://intrepidmuseum.org"
    }
];

//Variables in use
var map;
var clientID;
var clientSecret;
var infoWindow;

var Museum = function(data) {
	var self = this;
	this.name = data.name;
	this.lat = data.lat;
	this.lng = data.lng;
	this.url = data.url;
	this.address = "";
	this.city = "";
	this.phone = "";
	
    //show the museums on the map
	
	this.visible = ko.observable(true);

	var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.name;
    
    //Using Foursquare API to get info about the museum
	$.getJSON(foursquareURL).done(function(data) {
		var results = data.response.venues[0];

		self.address = results.location.formattedAddress[0];
     	self.city = results.location.formattedAddress[1];
      	self.phone = results.contact.formattedPhone;

	}).fail(function() {
		alert("Error occurs. Please refresh the page and try again to load Foursquare data.");
	}); 

	//Making the marker
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.lng),
			map: map,
			title: data.name,
			icon: 'https://maps.google.com/mapfiles/kml/shapes/museum_maps.png',
			animation: google.maps.Animation.DROP
	});
    
    //Making the info window
	infoWindow = new google.maps.InfoWindow();
    
    //Show the place if it is visible
	this.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);

	
	// opens Window 
    this.showinfo = function(){
    	
    	//close previous info window
    	infoWindow.close()
    	//Get the info about the museum
		var contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + '</b></div>' +
        '<div class="content">' + self.address + '</div>' +
        '<div class="content">' + self.city + '</div>' +
		'<div class="content"><a href="' + self.url +'">' + self.url + '</a></div>' +
        '<div class="content">' + self.phone + "</div></div>"

        infoWindow.setContent(contentString);

		infoWindow.open(map, this);

		self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	//Stop the animation
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 2000);

    };

	this.marker.addListener('click', self.showinfo);
    
    //Click the marker
	this.bounce = function() {
		google.maps.event.trigger(self.marker, 'click');
	};

	
};

function viewModel() {
	var self = this;

	this.searchTerm = ko.observable("");

	this.locationList = ko.observableArray([]);
	
	var styles = [	
	{
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6195a0"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#e6f3d6"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f4d2c5"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f4f4f4"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#787878"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#eaf6f8"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#eaf6f8"
            }
        ]
    }
	];

	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: {lat: 40.771957, lng: -73.974166},
			styles: styles

	});
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < initialMuseums.length; i++){

        bounds.extend(new google.maps.LatLng(initialMuseums[i].lat,initialMuseums[i].lng));
	}
	
	map.fitBounds(bounds);

	// Foursquare API settings
	clientID = "HKFJGSDPVPRZIYPLQCKMKTQG0AXBED2TOG0BUROD3T024HWI";
    clientSecret = "UFQU25P5CILLUNEQOOY25I052SX2KJO2SSSYYPGDJONENUSF";

    // Make "Museum" object
	initialMuseums.forEach(function(locationItem){
		self.locationList.push( new Museum(locationItem));
	});
	
	
    //show after searching
	this.filteredList = ko.computed( function() {
		
		var filter = self.searchTerm().toLowerCase();
		if (!filter) {
			self.locationList().forEach(function(locationItem){
				locationItem.visible(true);
			});
			return self.locationList();
		} else {
			return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
				var string = locationItem.name.toLowerCase();
				// define visible
				var result = (string.search(filter) >= 0);
				locationItem.visible(result);
				return result;
			});
		}
	}, this);

	this.mapElem = document.getElementById('map');

}

function startApp() {
	ko.applyBindings(new viewModel());
}

function errorHandling() {
	alert("Google Maps has failed to load. Please check your Internet connection and try again.");
}

