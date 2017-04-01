
const toAddress = 'lucky@scaleconsulting.co';

var sendContactMail = function(name, email, content, callback) {
  //console.log(name, email, content);
  var helper = require('sendgrid').mail;

  var emailObj = new helper.Email(toAddress);
  var contentObj = new helper.Content('text/plain', content);
  var mail = new helper.Mail(emailObj, 'from: ' + name + ' | ' + email, emailObj, contentObj);

  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, function(err, response) {
    if(err){
      console.log(err);
      return err;
    }
    console.log(response.statusCode);
    //console.log(response.body);
    //console.log(response.headers);
    callback();
  });
}

var sendNewSubscriptionMail = function(subject, content, callback) {
  console.log(content);
  var helper = require('sendgrid').mail;

  var emailObj = new helper.Email(toAddress);
  var contentObj = new helper.Content('text/plain', content);
  var mail = new helper.Mail(emailObj, 'New Subscription ' + subject, emailObj, contentObj);

  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, function(err, response) {
    if(err){
      console.log(err);
      // fall through error (local security issue)
      //callback(err);
    }
    //console.log(response.statusCode);
    //console.log(response.body);
    //console.log(response.headers);
    callback();
  });
}

module.exports.sendContactMail = sendContactMail;
module.exports.sendNewSubscriptionMail = sendNewSubscriptionMail;
