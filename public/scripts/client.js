
$(document).ready(function () {

  // $(() => {
  //   $.ajax({
  //     method: "GET",
  //     url: "/api/users"
  //   }).done((users) => {
  //     for (user of users) {
  //       $("<div>").text(user.name).appendTo($("body"));
  //     }
  //   });;
  // });

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

  const loadMaps = () => {
    $.ajax({
      method: "GET",
      url: "/api/maps"
    }).then(result => {

      $.each(result.maps, (key, value) => {

        const mapId = `map${value.id}`;

        $('.maps-list').append(`<div id='${mapId}' class='map'></div>`);

        const mymap = L.map(mapId).setView([value.center_lat, value.center_long], 13);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
        }).addTo(mymap);

        loadMarkers(value.id, mymap);
      });
    });
  };

loadMaps();

});
