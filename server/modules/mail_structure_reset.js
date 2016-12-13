'use strict'
var exports = module.exports = (function mail_structure(newUser){

  var config = require('./host.js');
  return {
    create : createContent
  };

  function createContent(newUser){

    var mail = '<div>';

    mail += '<h1>Mike\'s Shopping Cart</h1>';
    mail += '<div>';
    mail += '<h4>You have requested a password change. Here it is !</h4>';
    mail += '<p>This is your new password:'+ newUser.password + '</p>';
    mail += '<p>Have a nice day!</p>';
    mail += '</div>';
    mail += '</div>';

    return mail;
  }


})();
