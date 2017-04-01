var pg = require('pg');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const secret = 'SECRETSECRETSECRET123';

var User = function(user) {
  if (user) {
    this.id = user.id;
    this.salt = user.salt; //getSalt(password);
    this.hash = user.hash; //getHash(password, this.salt);
    this.email = user.email;
    this.fullname = user.fullname;
    this.phone = user.phone;
    if (user.plan && user.plan.id) {
      this.plan = user.plan.id;
    }
    else {
      this.plan = user.plan;
    }
  }
  this.validPassword = validPassword;
  this.getSalt = getSalt;
  this.getHash = getHash;
  this.generateJWT = generateJWT;
};
module.exports = User;

function getSalt(password) {
  return crypto.randomBytes(16).toString('hex');
};

function getHash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');
};

function validPassword(password) {
  return this.hash === crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

function generateJWT() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  //console.log ('jwt:' + this.username + "|" + this.id);
  return jwt.sign({
    _id: this.id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};
