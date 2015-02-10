/* jshint browser: true, jquery: true */
'use strict'

function hello() {
  return 'world';
}

var firebaseUrl = "https://myjsaddressbook.firebaseio.com/friends.json";
var $tbody = $('tbody');

//when page loads, add data from firebase to table
$(document).ready(function loadPageObjects() {
  console.log("page is loaded");

  $.get(firebaseUrl, function(res){
    Object.keys(res).forEach(function(uuid){
      addRowToTable(uuid, res[uuid]);
    });
  });


});

//when button is clicked, add friend to row on page
$('#addFriend').on('click',  function(event) {
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
                   '</td><tr>');

  //post data to firebase
  var friendToAdd = JSON.stringify({
                                   name: name,
                                   photoURL: url,
                                   twitter: twitter,
                                   github: github,
                                   email: email});
  $.post(firebaseUrl, friendToAdd, function(res) {
    $tr.attr('data-uuid', res.name);
    $('tbody').append($tr);
  });
});

function addRowToTable(uuid, obj){
  var $tr = $('<tr><td>' +
                   obj.name +
                   '</td><td><img src="' +
                   obj.url +
                   '"></td><td>' +
                   obj.twitter +
                   '</td><td>' +
                   obj.github +
                   '</td><td>' +
                   obj.email +
                   '</td><tr>');
  $tr.attr('data-uuid', uuid);
  $('tbody').append($tr);
};

