
$(document).ready(function () {

  //had to hardcode this. Need to change all instances where this is used!
  current_user = 1;

  loadMaps(current_user, undefined, undefined);

  renderProfileInfo(current_user);

  $('#profile-image').click(function () {
    $('#profile-banner').slideToggle('slow');
  });

  // landing page filtering

  $('form').on('submit', function (event) {
    event.preventDefault();
    $('.maps-list').html('');

    const $city = $(this).find('input').val().toLowerCase();
    const $category = $(this).find('option:selected').val().toLowerCase();

    $category === 'all categories' ? loadMaps(current_user, `${$city}`, undefined) : loadMaps(current_user, `${$city}`, `${$category}`);
  });

});
