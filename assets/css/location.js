//******************************************/
//**************  FUNCTIONS  ***************/
//******************************************/


  function initMap() {
    //var origin = {lat: 28.589, lng: -81.198};
    var origin = {lat: gLat, lng: gLong};
    console.log("gLat", gLat);
    console.log("gLong", gLong);

    //var map = new google.maps.Map(document.getElementById('map'), {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: origin
    });

    var clickHandler = new ClickEventHandler(map, origin);
}

/**  @constructor  */
var ClickEventHandler = function(map, origin) {
  this.origin = origin;
  this.map = map;
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);
  this.placesService = new google.maps.places.PlacesService(map);
  this.infowindow = new google.maps.InfoWindow;
  this.infowindowContent = document.getElementById('infowindow-content');
  this.infowindow.setContent(this.infowindowContent);

  // Listen for clicks on the map.
  this.map.addListener('click', this.handleClick.bind(this));
};

ClickEventHandler.prototype.handleClick = function(event) {
  console.log('You clicked on: ' + event.latLng);
  // If the event has a placeId, use it.
  if (event.placeId) {
    console.log('You clicked on place:' + event.placeId);

    // Calling e.stop() on the event prevents the default info window from
    // showing.
    // If you call stop here when there is no placeId you will prevent some
    // other map click event handlers from receiving the event.
    event.stop();
    this.calculateAndDisplayRoute(event.placeId);
    this.getPlaceInformation(event.placeId);
  }
};

ClickEventHandler.prototype.calculateAndDisplayRoute = function(placeId) {
  var me = this;
  this.directionsService.route({
    origin: this.origin,
    destination: {placeId: placeId},
    travelMode: 'WALKING'
  }, function(response, status) {
    if (status === 'OK') {
      me.directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
};

ClickEventHandler.prototype.getPlaceInformation = function(placeId) {
  var me = this;
  this.placesService.getDetails({placeId: placeId}, function(place, status) {
    if (status === 'OK') {
      me.infowindow.close();
      me.infowindow.setPosition(place.geometry.location);
      me.infowindowContent.children['place-icon'].src = place.icon;
      me.infowindowContent.children['place-name'].textContent = place.name;
      me.infowindowContent.children['place-id'].textContent = place.place_id;
      me.infowindowContent.children['place-address'].textContent =
          place.formatted_address;
      me.infowindow.open(me.map);
    }
  });
};

