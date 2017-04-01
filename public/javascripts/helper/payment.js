var subscribe = function (user, card, callback)
{
  const userObj = require('../../../public/javascripts/helper/user.js');
  const mailObj = require('../../../public/javascripts/helper/mail.js');
  const userData = require('../../../public/javascripts/data/user.js');

  var stripe = require("stripe")(
    "sk_test_F1SmqeDZAzKfwOs6A7mUEGkE"
  );

  stripe.customers.create({
    description: 'Customer for ' + user.plan,
    email: user.email
  }, function(err, stripe_customer) {
    if(err){
      console.log(err);
      return err;
    }
    console.log(stripe_customer);

    userData.setUser(user, stripe_customer.id, function (err, userReturn) {
      if(err){
        console.log(err);
        return err;
      }

      stripe.subscriptions.create({
        customer: stripe_customer.id,
        plan: user.plan,
        source:  {
          object: 'card',
          number: card.number,
          exp_month: card.expiry_month,
          exp_year: card.expiry_year,
          cvc: card.cvc
        }
      }, function(err, subscription) {
        if(err){
          console.log(err);
          return err;
        }
        console.log(subscription);

        var subject = 'Plan: ' + user.plan;
        var content = 'Name:' + user.fullname + ', Email:' + user.email;

        mailObj.sendNewSubscriptionMail(subject, content, function(err) {
          if(err){
            console.log(err);
            console.log('error');
            callback(err);
          }
          callback(null, userReturn.id);
        });

        //generate Token?
        //return res.json({token: userObjNew.generateJWT()});
      });
    });
  });
}


module.exports.subscribe = subscribe;
