// import * as helpers from '../helpers/mapHelpers.js';
$(document).ready(function () {

  //had to hardcode this. Need to change all instances where this is used!
  current_user = 1;

  loadMaps(current_user, undefined, undefined);

  // landing page filtering
  $('.maps-form form').on('submit', function (event) {
    event.preventDefault();
    $('.maps-list').html('');

    const $city = $(this).find('input').val();
    const $category = $(this).find('option:selected').val().toLowerCase();
    console.log($category)
    $category === 'all categories' ? loadMaps(current_user, `${$city}`, undefined) : loadMaps(current_user, `${$city}`, `${$category}`);
  });

  $('nav form button').click(event => {
    event.preventDefault();
    const button = event.target.attributes.name.nodeValue;
    const login = (button === 'login' ? true : false);
    if (!login) {
      $('.modal-body button').text('Sign Up');
      $('#loginModalLabel').text('Sign Up');
      $('.sign-up').css('display', 'block');
      $('.sign-up input').prop('required',true);
    } else
    {
      $('.modal-body button').text('Login');
      $('#loginModalLabel').text('Login');
      $('.sign-up input').prop('required',false);
      $('.sign-up').css('display', 'none');
    }
  })

});

 $('.modal-body form').submit(event => {
  event.preventDefault();
  // console.log(event);
  const button = $('.modal-body button').text();
  const login = (button === 'Login' ? true : false)
  if (!login) {
    const info = {email:$('#email').val(), password:$('#password').val(), city:$('#city').val(), name:$('#user-name').val()};
   $.ajax({
     url: 'api/users/register',
     type: "POST",
     data: info
   })
   .then(() => {
    $('.close').click();
  })
  .catch(err => {
    $('#login-error').html('Email already in use, try loging in').slideDown();
  })
  } else {
    const info = {email:$('#email').val(), password:$('#password').val()};

    $.ajax({
      url: 'api/users/login',
      type: "POST",
      data: info
    })
    .then(() => {
     $('.close').click();
   })
   .catch(err => {
     console.log('error',err)
     $('#login-error').html('User does not exist').slideDown();
   })
  }

});
