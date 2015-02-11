/* jshint browser: true, jquery: true */
'use strict'

function hello() {
  return 'world';
}

var firebaseUrl   = "https://myjsaddressbook.firebaseio.com/friends.json",
    $tbody        = $('tbody'),
    rawFbUrl      = "https://myjsaddressbook.firebaseio.com",
    fb            = new Firebase(rawFbUrl),
    usersFbUrl;

$(document).ready(function () {
  console.log("page is loaded");
  $('.makeFriends').hide();
});

///////////// LOGIN & AUTH PIECE ///////////////
    //if you're logged in, login elements shouldn't appear
if (fb.getAuth()) {
  $('.login').remove();
  $('.app').toggleClass('hidden');
  //$('.logout').toggleClass('hidden');

  usersFbUrl = rawFbUrl + '/users/' + fb.getAuth().uid + '/data/';

  $.get(usersFbUrl + 'friends/.json', function (res) {
    Object.keys(res).forEach(function (uuid) {
      addRowToTable(uuid, res[uuid]);
    });
  });
 }
    //Register & Login
 $('#registerButton').click(function (event) {
   event.preventDefault();
   var $loginForm = $('#loginForm'),
       email      = $('#signinEmail').val(),
       pass       = $('#signinPassword').val(),
       data       = {email: email, password: pass};
   registerAndLogin(data, function (err, auth) {
     if (err) {
       $('.error').text(err);
     } else {
       location.reload(true);
     }
   });
 });

 $('#loginButton').click(function(event){
   var $loginForm = $('#loginForm'),
       email      = $('#signinEmail').val(),
       pass       = $('#signinPassword').val(),
       data       = {email: email, password: pass};

   event.preventDefault();

   fb.authWithPassword(data, function(err, auth){
     if (err) {
       $('.error').text(err);
     } else {
       location.reload(true);
     }
   });
 });

$('.logout').click(function () {
  fb.unauth();
  location.reload(true);
})

function registerAndLogin(obj, cb) {
  fb.createUser(obj, function(err) {
    if (!err) {
      fb.authWithPassword(obj, function (err, auth){
        if (!err) {
          cb(null, auth);
        } else {
          cb(err);
        }
      });
    } else {
      cb(err);
    }
  });
}

function exposeForm() {
  $('.makeFriends').toggle();
}
$('#startAdding').on('click', exposeForm);

//when button is clicked, add friend to row on page
$('form').submit(function(event) {
  event.preventDefault();

  var name     = $('#name').val(),
      url      = $('#photo').val(),
      twitter  = $('#twitter').val(),
      github   = $('#github').val(),
      email    = $('#email').val(),
      $tbody   = $('tbody'),
      $tr      = $('<tr><td>' +
                   name +
                   '</td><td><img src="' +
                   url +
                   '"></td><td>' +
                   twitter +
                   '</td><td>' +
                   github +
                   '</td><td>' +
                   email +
                   '</td><td><button id="removeRow">Remove</button><tr>');
  //post data to firebase
  var friendToAdd = JSON.stringify({
                                   name: name,
                                   photoURL: url,
                                   twitter: twitter,
                                   github: github,
                                   email: email});
  $.post(usersFbUrl + '/friends/.json', friendToAdd, function(res) {
    $tr.attr('data-uuid', res.name);
    $('tbody').append($tr);

  //clear out fields
  $('#name').val("");
  $('#photo').val("");
  $('#twitter').val("");
  $('#github').val("");
  $('#email').val("");
  $('.makeFriends').hide();
  });
});

function addRowToTable(uuid, obj){
  var $tr = $('<tr><td>' +
                   obj.name +
                   '</td><td><img src="' +
                   obj.photoURL +
                   '"></td><td>' +
                   obj.twitter +
                   '</td><td>' +
                   obj.github +
                   '</td><td>' +
                   obj.email +
                   '</td><td><button id="removeRow">Remove</button><tr>');

  $tr.attr('data-uuid', uuid);
  $('tbody').append($tr);
};

//remove row functionality
$('tbody').on('click', '#removeRow', function(evt){
  var $tr = $(evt.target).closest('tr');
  $tr.remove();

  var uuid = $tr.data('uuid');
  var url = usersFbUrl + uuid + '.json';
  $.ajax(url, {type: 'DELETE'});
});

