$(document).ready(function () {
  if (!sessionStorage.getItem('isLoggedIn')) {
    $('#create-new-map').css('display', 'none');
    $('#logged-in span').html();
  } else {
    $('#create-new-map').css('display', 'block');
    $('#logged-in span').html(`Logged in as: ${sessionStorage.getItem('email')}`);
  }
});

function saveMap(map,id) {
  const points = [];
  map.eachLayer(function (layer) {
    if (layer.editing) {
      points.push(layer.toGeoJSON());
    }
  });
  url = id ? `/api/maps/${id}`: '/api/maps'
  $.ajax({
    url,
    type: 'POST',
    dataType: "json",
    data: { layers: JSON.stringify(points) }
  })
    .then(() => {
      $('#map').css('display', 'none').empty();
      $('.maps-list').css("display", 'block');
      loadMaps(1)
    })

    .catch(error => {
      return;
    });
}


function createNewMap(id) {

  $('#map').css('display', 'block');
  $('#create-new-map').css("display", 'none');
  $('.map-list').css("display", 'none');
  $('header#profile-banner').css("display", 'none');
  const map = L.map('map').setView([51.505, -0.09], 13);

  drawnItems = new L.FeatureGroup().addTo(map);
  editActions = [
    L.Toolbar2.EditAction.Popup.Edit,
    L.Toolbar2.EditAction.Popup.Delete,
    L.Toolbar2.Action.extend({
      options: {
      toolbarIcon: {
      className: 'leaflet-color-picker',
      html: '<ion-icon name="information-circle-outline"></ion-icon>'
    },
    subToolbar:
     new L.Toolbar2({ actions: [
      L.ColorPicker.extendOptions({ color: '#db1d0f' }),
      L.ColorPicker.extendOptions({ color: '#025100' }),
      L.ColorPicker.extendOptions({ color: '#ffff00' }),
      L.ColorPicker.extendOptions({ color: '#0000ff' })
    ]})
  }})

  ];
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYW1yaGFtYWRhIiwiYSI6ImNrOW9wMjU3OTAyeXkzZ3FzZ3E0aHQ3dGsifQ.X4zjaqxq3wEeLdAIgVOE6A'
  }).addTo(map);

  map.on('draw:created', function (evt) {
    var type = evt.layerType,
      layer = evt.layer;
    feature = layer.feature = layer.feature || {};
    feature.type = feature.type || "Feature";
    var props = feature.properties = feature.properties || {};
    props.desc = null;
    props.title = null;
    props.image = null;
    drawnItems.addLayer(layer);
    addPopup(layer);

    layer.on("add", function (event) {
      event.target.openPopup();
    });

    layer.on('click', function (event) {
      new L.Toolbar2.EditToolbar.Popup(event.latlng, {
        actions: editActions
      }).addTo(map, layer);
    });

    function addPopup(layer) {

      var content = document.createElement('div');

      let contentDesc = document.createElement('input')
      contentDesc.setAttribute('placeholder', 'set description')
      var contentTitle = document.createElement('input');
      contentTitle.setAttribute('placeholder', 'set title')
      var contentImage = document.createElement('input');
      contentImage.setAttribute('placeholder', 'link your image')
      content.appendChild(contentDesc);
      content.appendChild(contentTitle);
      content.appendChild(contentImage);

      content.addEventListener("keyup", function () {
        layer.feature.properties.desc = contentDesc.value;
        layer.feature.properties.title = contentTitle.value;
        layer.feature.properties.image = contentImage.value;
      });

      layer.on("popupopen", function () {
        contentDesc.value = layer.feature.properties.desc;
        contentTitle.value = layer.feature.properties.title;
        contentImage.value = layer.feature.properties.image;
        content.focus();
      });
      layer.bindPopup(content).openPopup();
    }
  });



  new L.Toolbar2.DrawToolbar({
    position: 'topleft'
  }).addTo(map);

  if (id) {
    loadLayers(id, map);
    $('#map').css('display', 'block');
    $('.maps-list').html('');
  }
  L.easyButton('<ion-icon name="save-outline"></ion-icon>', function () {
    if (id) {
      saveMap(map,id)
    } else {
      saveMap(map);
    }
    map.remove();
    $('#create-new-map').css("display", 'block');
  }, 'Save').addTo(map);

};


