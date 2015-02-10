/* jshint browser: true, jquery: true */
'use strict'

function hello() {
  return 'world';
}

var firebaseUrl   = "https://myjsaddressbook.firebaseio.com/friends.json",
    $tbody        = $('tbody'),
    rawFbUrl      = "https://myjsaddressbook.firebaseio.com";

//when page loads, add data from firebase to table
$(document).ready(function () {
  console.log("page is loaded");
  //hide the form
  $('.makeFriends').hide();
  //load existing contacts from firebase
  $.get(firebaseUrl, function(res){
    Object.keys(res).forEach(function(uuid){
      addRowToTable(uuid, res[uuid]);
    });
  });
//show contact form when button is clicked

});//end .ready function

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
  $.post(firebaseUrl, friendToAdd, function(res) {
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
  var url = "https://myjsaddressbook.firebaseio.com/friends/" + uuid + '.json';
  $.ajax(url, {type: 'DELETE'});
});

