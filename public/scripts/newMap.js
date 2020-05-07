$(document).ready(function () {
  if (!sessionStorage.getItem('isLoggedIn')) {
    $('#create-new-map').css('display', 'none');
   $('#logged-in span').html();
  } else {
    $('#create-new-map').css('display', 'block');
    $('#logged-in span').html(`Logged in as: ${sessionStorage.getItem('email')}`);
  }
});

function saveMap(map){
  const points = [];
  map.eachLayer(function(layer){
    if (layer.editing) {
      points.push(layer.toGeoJSON());
    }
});

  $.ajax({
    url: '/api/maps',
    type: 'POST',
    dataType: "json",
    data: {layers: JSON.stringify(points)}
  })
  .then(() => {
    $('#map').css('display', 'none').empty();
    $('.maps-list').css("display", 'block');
    loadMaps(1)})

  .catch(error => {
    return;
  });
}


function createNewMap() {
  if (sessionStorage.getItem('status') != null) {

  }
  $('#map').css('display', 'block');
  $('#create-new-map').css("display", 'none');
  $('.map-list').css("display", 'none');
  const map = L.map('map').setView([51.505, -0.09], 13);
  drawnItems = new L.FeatureGroup().addTo(map);
  editActions = [
    L.Toolbar2.EditAction.Popup.Edit,
    L.Toolbar2.EditAction.Popup.Delete,

  ];
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiYW1yaGFtYWRhIiwiYSI6ImNrOW9wMjU3OTAyeXkzZ3FzZ3E0aHQ3dGsifQ.X4zjaqxq3wEeLdAIgVOE6A'
  }).addTo(map);

  map.on('draw:created', function(evt) {
    var	type = evt.layerType,
      layer = evt.layer;

    drawnItems.addLayer(layer);

    layer.on('click', function(event) {
      new L.Toolbar2.EditToolbar.Popup(event.latlng, {
        actions: editActions
      }).addTo(map, layer);
    });
  });

  new L.Toolbar2.DrawToolbar({
    position: 'topleft'
  }).addTo(map);


  L.easyButton( '<ion-icon name="save-outline"></ion-icon>', function(){
    saveMap(map);
    map.remove();
    $('#create-new-map').css("display", 'block');
  }, 'Save').addTo(map);

};


