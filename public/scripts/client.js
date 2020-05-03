
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

  $(() => {
    $.ajax({
      method: "GET",
      url: "/api/maps"
    }).then(maps => {

      const mapList = [];
      console.log(maps);

      $.each(map => {
        console.log(map);

        $('.maps-list').append(`<div id='${map.id}'></div>`);

        const mapElem = L.map(map.id).setView([map.centerLat, map.centerLong], 13);
        console.log(mapObj.centerLat);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
        }).addTo(mymap);

        mapList.push(mapElem);
      });
    });
  });

  // const mapDivs = document.getElementsByClassName("map");
  // const maps = [];

  // for (var i = 0; i < mapDivs.length; i++) {
  //   initializeMap(mapDivs[i].id);
  // }

  // function initializeMap(id) {
  //   const mymap = L.map(id).setView([51.505, -0.09], 13);

  //   L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //     maxZoom: 18,
  //     id: 'mapbox/streets-v11',
  //     tileSize: 512,
  //     zoomOffset: -1,
  //     accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  //   }).addTo(mymap);

  //   maps.push(mymap);
  // }


});
