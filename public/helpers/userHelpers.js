
const renderProfileInfo = (userId) => {
  $.ajax({
    method: "GET",
    url: `/api/users/${userId}`
  }).then(result => {
    $('#profile-thumbnail').attr('src', `${result.users[0].profile_image}`);
    $('#profile-large').attr('src', `${result.users[0].profile_image}`);
    $('#user-related').append(`<h3>${result.users[0].name}</h3>`);
    $('#user-related').append(`<h2>${result.users[0].city}</h2>`);
  });
};

