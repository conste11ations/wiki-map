
$(document).ready(function () {

    //had to hardcode this. Need to change all instances where this is used!
  // let current_user = 1;

  if (!sessionStorage.getItem('isLoggedIn')) {
    $('#logged-in').css('display', 'none');
    $('.login-options').css('display', 'block');
  } else {
    $('#logged-in').css('display', 'block');
    $('.login-options').css('display', 'none');
  }
  console.log(sessionStorage.getItem('isLoggedIn'));

  $('#logged-in').click(event => {
    event.preventDefault()
    $.ajax({
      url: 'api/users/logout',
      type: "POST",
      data: ''
    })
    .then(() => {
     sessionStorage.clear();
     location.reload();
   })
   .catch(err => {

    //  $('#login-error').html('Email already in use, try loging in').slideDown();
   })
  })

  $('nav form').click(event => {
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
      sessionStorage.setItem('isLoggedIn', true);
      sessionStorage.setItem('user_id', `${res.id}`)
      sessionStorage.setItem('email', `${email}`)
      $('.close').click();
      location.reload();
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
      .then((res) => {
        current_user = res.id;
        sessionStorage.setItem('isLoggedIn',true);
        sessionStorage.setItem('user_id', `${res.id}`)
        sessionStorage.setItem('email', `${res.email}`)
       $('.close').click();
       location.reload();
     })
     .catch(err => {
       console.log('error',err)
       $('#login-error').html('User does not exist').slideDown();
     })
    }
  });


  renderProfileInfo(sessionStorage.getItem('user_id'));

  loadMaps(sessionStorage.getItem('user_id'), undefined, undefined);

  $('#profile-image').click(function () {
    $('#profile-banner').slideToggle('slow');
  });

  // landing page filtering
  $('form#public-maps-list').on('submit', function (event) {
    event.preventDefault();
    $('.maps-list').html('');

    const $city = $(this).find('input').val().toLowerCase();
    const $category = $(this).find('option:selected').val().toLowerCase();

      $category === 'all categories' ? loadMaps(sessionStorage.getItem('user_id'), `${$city}`, undefined) : loadMaps(sessionStorage.getItem('user_id'), `${$city}`, `${$category}`);

  });

});




