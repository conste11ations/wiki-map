
const loadLayers = (mapId, mapObj) => {
  $.ajax({
    method: "GET",
    url: `/api/maps/${mapId}/map_points`
  }).then(result => {
    $.each(result.maps, (key, value) => {

      const layerProp = JSON.parse(value.layers).properties;
// to account for the edit/delete palette action in createMap creating extra rows in db
      if (!(Object.keys(layerProp).length === 0 && layerProp.constructor === Object)) {
      const popupContent =
      `<b>Title:</b> ${layerProp.title}</br>
      <b>Description:</b> ${layerProp.desc}</br>
      <b>Thumbnail:</b></br><img src="${layerProp.image}" alt="${layerProp.title} pic" height="100" width="100"/>`;
      L.geoJSON(JSON.parse(value.layers), {
        onEachFeature: (feature, layer) => {
          layer.bindPopup(popupContent);
        }
      }).addTo(mapObj);
    }
    });
  });
};

const addFavorite = (userId, mapId) => {
  $.ajax({
    method: 'POST',
    url: `/api/users/${userId}/favorites`,
    data: {
      user_id: userId,
      map_id: mapId,
      delete: false
    },
  }).then(result => {

  });
};

const removeFavorite = (userId, mapId) => {
  $.ajax({
    method: 'POST',
    url: `/api/users/${userId}/favorites`,
    data: {
      user_id: userId,
      map_id: mapId,
      delete: true
    }
  }).then(result => {

  });
};

const createFavoritesButton = (userId, mapObj) => {
  const favoritesButton = L.easyButton({
    states: [{
      stateName: 'not-starred',
      icon: `<span class="star" id="${mapObj._container.id}">&starf;</span>`,
      title: 'Not favorited',
      onClick: (btn, map) => {
        btn.state('yellow-starred');
        addFavorite(userId, map._container.id.substring(3));
      }
    }, {
      stateName: 'yellow-starred',
      icon: `<span class="star-yellow" id="${mapObj._container.id}">&starf;</span>`,
      title: 'Is favorited',
      onClick: (btn, map) => {
        btn.state('not-starred');
        removeFavorite(userId, map._container.id.substring(3));
      }
    }]
  });
  favoritesButton.addTo(mapObj);
};

// loads the user's stars for a given map list (yellow denotes favorited by user, black is otherwise)
const loadFavorites = (userId, mapList) => {

  $.each(mapList, (key, value) => {
    createFavoritesButton(userId, value);
  });

  $.ajax({
    method: 'GET',
    url: `/api/users/${userId}/favorites`
  }).then(result => {

    $.each(result.users, (key, value) => {
      if (mapList['map' + value.map_id] && $(`span.star#map${value.map_id}`)) {
        removeFavorite(userId, value.map_id);
        $(`span.star#map${value.map_id}`).click();
      }
    });
  });
};


const loadMaps = (userId, city, category,favorites, contributions) => {
  $.ajax({
    method: 'GET',
    url: '/api/maps',
    data: {
      city,
      category,
      favorites,
      contributions
    }
  }).then(result => {
    $('#map').css('display', 'none');
    $('.maps-list').html('');
    let mapList = {};

    $.each(result.maps, (key, value) => {

      const mapId = `map${value.id}`;
      $('.maps-list').append(`<div id='${mapId}' class='map' data-city='${value.city}' data-category='${value.category}'></div>`);
      const mymap = L.map(mapId).setView([value.center_lat, value.center_long], 13);

      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/outdoors-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      }).addTo(mymap);


      if (sessionStorage.getItem('isLoggedIn')) {
        L.easyButton('<ion-icon name="create-outline"></ion-icon>', function () {
          createNewMap(value.id);
          // map.remove();
          // $('#create-new-map').css("display", 'block');
        }, 'Edit').addTo(mymap);
      }

      loadLayers(value.id, mymap);
      mapList[mapId] = mymap;
    });
    if (sessionStorage.getItem('isLoggedIn')) {
    loadFavorites(userId, mapList);
    }
  });
}

