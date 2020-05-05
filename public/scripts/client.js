
$(document).ready(function () {

  const loadMarkers = (mapId, mapObj) => {
    $.ajax({
      method: "GET",
      url: `/api/maps/${mapId}/map_points`
    }).then(result => {
      $.each(result.maps, (key, value) => {
        L.marker([value.latitude, value.longitude]).addTo(mapObj);
      });
    });
  };

  // loads the user's stars for a given map list (yellow denotes favorited by user, black is otherwise)
  const loadFavorites = (userId, mapList) => {

    $.each(mapList, (key, value) => {
      L.easyButton( '<span class="star">&starf;</span>', function(){
        alert('you just clicked the html entity \&starf;');
      }).addTo(value);
    });

    $.ajax({
      method: "GET",
      url: `/api/users/${userId}/favorites`
    }).then(result => {

      let favoritedMaps = [];
      $.each(result.maps, (key, value) => {
        favoritedMaps = mapList.filter(map => map._container.id === 'map' + value.map_id);
        console.log(favoritedMaps);

        if (favoritedMaps.length > 0) {
            L.easyButton( '<span class="star-yellow">&starf;</span>', function(){
              alert('you just clicked the html entity \&starf;');
            }).addTo(favoritedMaps[0]);
        }
      });
      console.log(favoritedMaps);

    });
  };

  const loadMaps = (city, category) => {
    $.ajax({
      method: "GET",
      url: "/api/maps",
      data: {
        city: city,
        category: category
      }
    }).then(result => {

      let mapList = [];

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

        mymap.pm.addControls({
          position: 'topleft',
          drawCircle: false,
        });

        loadMarkers(value.id, mymap);
        mapList.push(mymap);
      });
// TODO needs to be refactored once the concept of authenticated users is introduced (remove hardcoded param of 1)
      loadFavorites(1, mapList);
    });
  };

  loadMaps(undefined, undefined);

  // landing page filtering
  $('form').on('submit', function(event) {
      event.preventDefault();
      $('.maps-list').html('');

      const $city = $(this).find('input').val();
      const $category = $(this).find('option:selected').val().toLowerCase();

    loadMaps(`${$city}`, `${$category}`);
  });


});
