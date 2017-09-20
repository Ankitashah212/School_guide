//******************************************/
//**************  FUNCTIONS  ***************/
//******************************************/
function initMap() {
//set location as lat and lng from school object
  var myCenter = new google.maps.LatLng(gLat, gLong);
  var mapCanvas = document.getElementById("googleMap");
  var mapOptions = { center: myCenter, zoom: 10 };
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;

  geocodeLatLng(geocoder, map, infowindow, myCenter);
}
// function to get the map an actual address reverse geocoded from lat a=lng
function geocodeLatLng(geocoder, map, infowindow, myCenter) {
  
  geocoder.geocode({ 'location': myCenter }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
          position: myCenter,
          map: map
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      }
    }
  });
}
