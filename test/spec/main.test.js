/* jshint browser: true, jquery: true */
'use strict'
describe('test suite', function() {
  it('should assert true', function () {
    true.should.be.true;
    false.should.be.false;
  });
});
describe('hello', function () {
  it('should return world', function () {
    hello().should.equal('world');
  });
});
describe('DOM', function () {
  describe('address book page', function () {
    before(function () {
      if (window.__karma__) {
        $('body').append('<div class="contactForm"></div>');
        $('body').append('<table><thead></thead><tbody></tbody></table>');
      }
    });

    beforeEach(function () {
      $('.contactFormContainer').hide();
      $('tbody').empty();
    });
describe('addRowToTable', function() {
  it('should add a row to the table', function () {
    $('tr').length.should.equal(0);
    addRowToTable('abcdefghijklmnop', { name: 'jack', url: 'google.com', twitter: '@jack', github: 'jacksparrow', email: 'jack@ocean.org' } );
    $('tr').length.should.equal(2);
  });
});
//describe('exposeForm', function() {
  //it('should expose the form for a user to edit', function () {
    //$('.makeFriends')[0].style.cssText === "display: none;";
    //exposeForm();
    //$('.makeFriends')[0].style.cssText === "display: block;";
  //});
//});

