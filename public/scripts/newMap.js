
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
    data: {items: JSON.stringify(points)}
  })
  .then(() => {
    $('#map').css('display', 'none').empty();
    $('.maps-list').css("display", 'block');
    loadMaps(1)})
  // .then( results => {
  //   $('#map').css('display', 'none');
  //   $('.maps-list').css("display", 'block').empty();
  //   console.log(results)
  //   $('#map').css('display', 'none');
  //   $('.map-list').css("display", 'block').empty();
  //   $.each(results.maps, (key, value) => {
  //     console.log(value.map_id);
  //     console.log(value);
  //     const mapId = `map${value.map_id}`;
  //     // class='map' data-city='${value.city}' data-category='${value.category}
  //     $('.map-list').append(`<div id='${mapId}'></div>`);
  //     const map = L.map(mapId).setView([51.505, -0.09], 13);
  //     L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //     maxZoom: 18,
  //     id: 'mapbox/streets-v11',
  //     tileSize: 512,
  //     zoomOffset: -1,
  //     accessToken: 'pk.eyJ1IjoiYW1yaGFtYWRhIiwiYSI6ImNrOW9wMjU3OTAyeXkzZ3FzZ3E0aHQ3dGsifQ.X4zjaqxq3wEeLdAIgVOE6A'
  //     }).addTo(map);
  //     L.geoJSON(JSON.parse(value.layers)).addTo(map);
  //   });
  //   console.log('hello');
  // })
  .catch(error => {
    return;
  });
}
// function createLabel(layer, text, map){
//  removeLabel(layer);
//     var icon = createStaticLabelIcon(text);
//   var testspan = document.createElement("span");
//   document.body.appendChild(testspan);

//   testspan.className = "textwidth";
//   testspan.style.fontSize = "10px";
//   testspan.innerHTML = text;
//   var width = testspan.clientWidth +11;
//   icon.options.iconAnchor = [width  / 2, -4]; //That the label is centered

//   var label = L.marker(layer.getLatLng(),{icon: icon}).addTo(map);
//   layer.appendedLabel = label;

//   document.body.removeChild(testspan);
// }

// function removeLabel(layer){
//  if(layer.appendedLabel){
//         map.removeLayer(layer.appendedLabel); //Remove label that connected with marker, else the label will not removed
//   }
// }

// function createStaticLabelIcon(labelText) {
//     return L.divIcon({
//         className: "leaflet-marker-label",
//         html: '<span class="leaflet-marker-iconlabel" style="background: #fff; color: #000;";>'+labelText+'</span>',
//         text : labelText,
//     });
// }

function createNewMap() {
  $('#map').css('display', 'block');
  $('#create-new-map').css("display", 'none');
  $('.map-list').css("display", 'none');
  const map = L.map('map').setView([51.505, -0.09], 13);
  drawnItems = new L.FeatureGroup().addTo(map);
  editActions = [
    L.Toolbar2.EditAction.Popup.Edit,
    L.Toolbar2.EditAction.Popup.Delete,
    // L.Toolbar2.extendOptions({
    //   toolbarIcon: {
    //     className: 'leaflet-color-picker',
    //     html: '<span class="fa fa-eyedropper"></span>'
    //   },
    //   subToolbar: new L.Toolbar2({ actions: [
    //     L.Toolbar2.extendOptions({ color: '#db1d0f' }),
    //     L.ColorPicker.extendOptions({ color: '#025100' }),
    //     L.ColorPicker.extendOptions({ color: '#ffff00' }),
    //     L.ColorPicker.extendOptions({ color: '#0000ff' })
    //   ]})
    // })
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
    // console.log(evt)
    var	type = evt.layerType,
      layer = evt.layer;

    // console.log(JSON.stringify(layer.toGeoJSON()))
    // console.log(JSON.stringify(layer.toGeoJSON()).length)
    drawnItems.addLayer(layer);
    // createLabel(layer,"test", map);

    layer.on('click', function(event) {
      new L.Toolbar2.EditToolbar.Popup(event.latlng, {
        actions: editActions
      }).addTo(map, layer);
    });
  });

  new L.Toolbar2.DrawToolbar({
    position: 'topleft'
  }).addTo(map);

  // c('save-icon',)

  L.easyButton( '<ion-icon name="save-outline"></ion-icon>', function(){
    saveMap(map);
    map.remove();
    $('#create-new-map').css("display", 'block');
  }, 'Save').addTo(map);
// new L.Toolbar2.EditToolbar.Control({
//   position: 'topleft'
// }).addTo(map, drawnItems);

};


