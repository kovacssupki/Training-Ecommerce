'use strict'
var exports = module.exports = (function mail_structure(newUser){
  var config = require('./host.js');
  return {
    create:createContent
  };

  function createContent(newUser){

    var mail = '<div>';

    mail += '<h1>Mike\'s Shopping Cart</h1>';
    mail += '<div>';
    mail += '<h4>You\'re on your way!</h4>';
    mail += '<p>By clicking on the following link, you are confirming your email address and agreeing to Mike\'s Shopping Cart <a>Terms of Service</a></p>';
    mail += '<p>This is your confirmation code:' + newUser.activationCode +'</p>';
    mail += '<p>Hit the confirm button and copy/paste the code for completing registration.</p>';
    mail += '<a href="'+ config.host + ':' + config.port +'/#/activate">Confirm Email Address</a>';
    mail += '</div>';
    mail += '</div>';

    return mail;
  }
})();
