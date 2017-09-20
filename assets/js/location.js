//******************************************/
//**************  FUNCTIONS  ***************/
//******************************************/


function initMap() {
  var myCenter = new google.maps.LatLng(gLat, gLong);
  var mapCanvas = document.getElementById("googleMap");
  var mapOptions = { center: myCenter, zoom: 10 };
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var marker = new google.maps.Marker({ position: myCenter });
  marker.setMap(map);
}

