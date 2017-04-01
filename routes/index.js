const express = require('express');
const passport = require('passport');
const userObj = require('../public/javascripts/helper/user.js');
const emailObj = require('../public/javascripts/helper/mail.js');
const paymentObj = require('../public/javascripts/helper/payment.js');
const userData = require('../public/javascripts/data/user.js');
const intelData = require('../public/javascripts/data/intel.js');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('guest');
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info){
    if(err){
      console.log(err);
      return next(err);
    }
    var userObjNew = new userObj(user);
    if(user){
      return res.json({token: userObjNew.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/contact', function(req, res, next){
  //console.log(req.body);
  try {
    emailObj.sendMail(req.body.fullname, req.body.email, req.body.content);
  }
  catch (e)
  {
    console.log(e);
  }
});

router.post('/pay', function(req, res, next){
  if(!req.body.email || !req.body.password){
    return res.status(400).json({message: 'Please fill all fields'});
  }

  var user = new userObj(req.body);
  user.salt = user.getSalt(req.body.password);
  user.hash = user.getHash(req.body.password, user.salt);

  var card = {
    number: req.body.cardnumber,
    expiry_month: req.body.expirymm,
    expiry_year: req.body.expiryyy,
    cvc: req.body.cvc
  }

  paymentObj.subscribe(user, card, function(err, user){
    if(err){
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    return res.json('cool');
  });
});

router.get('/api/pricing/:category/range/:yearStart/:monthStart/:yearEnd/:monthEnd', function(req, res, next) {
  intelData.getPricing('range', req.params.category, req.params.yearStart, req.params.monthStart, req.params.yearEnd, req.params.monthEnd, function (err, results) {
    if (err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    return res.json(results);
  });
});

router.get('/api/pricing/:category/sum/:yearStart/:monthStart/:yearEnd/:monthEnd', function(req, res, next) {
  intelData.getPricing('sum', req.params.category, req.params.yearStart, req.params.monthStart, req.params.yearEnd, req.params.monthEnd, function (err, results) {
    if (err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    return res.json(results);
  });
});

router.get('/api/pricing/:category/:year', function(req, res, next) {
  intelData.getPricing('year', req.params.category, req.params.year, null, null, null, function (err, results) {
    if (err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    return res.json(results);
  });
});

router.get('/api/pricing/:category/:year/:month', function(req, res, next) {
  intelData.getPricing('month', req.params.category, req.params.year, req.params.month, null, null, function (err, results) {
    if (err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    return res.json(results);
  });
});

router.get('/api/location/:category/range/:yearStart/:monthStart/:yearEnd/:monthEnd', function(req, res, next) {
  intelData.getAttr('range', req.params.category, req.params.yearStart, req.params.monthStart, req.params.yearEnd, req.params.monthEnd, function (err, results) {
    if (err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    return res.json(results);
  });
});

router.get('/api/location/:category/sum/:yearStart/:monthStart/:yearEnd/:monthEnd', function(req, res, next) {
  intelData.getAttr('sum', req.params.category, req.params.yearStart, req.params.monthStart, req.params.yearEnd, req.params.monthEnd, function (err, results) {
    if (err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    return res.json(results);
  });
});

router.get('/api/location/:category/:year', function(req, res, next) {
  intelData.getAttr('year', req.params.category, req.params.year, null, null, null, function (err, results) {
    if (err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    return res.json(results);
  });;
});

router.get('/api/location/:category/:year/:month', function(req, res, next) {
  intelData.getAttr('month', req.params.category, req.params.year, req.params.month, null, null, function (err, results) {
    if (err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    return res.json(results);
  });
});

router.get('/api/sales/:category/:yearStart/:monthStart/:yearEnd/:monthEnd', function(req, res, next) {
  intelData.getSales('location', req.params.category, req.params.yearStart, req.params.monthStart, req.params.yearEnd, req.params.monthEnd, function (err, results) {
    if (err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    return res.json(results);
  });
});

module.exports = router;
