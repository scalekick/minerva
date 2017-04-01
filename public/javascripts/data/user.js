var pg = require('pg');
const connectionString = process.env.DATABASE_URL;

var getUser = function(username, callback) {
  var result;
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      if (err) return callback(err);
    }

    var query = client.query('select * from users where username=$1', [username]);

    query.on('row', (row) => {
      result = row;
    });
    query.on('end', () => {
      done();
      callback(null, result);
    });
  });
}

var setUser = function(user, stripe_id, callback) {
  var result;

  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      if (err) return callback(err);
    }

    var query = client.query('insert into users (username, salt, hash, name, phone, stripe_id, plan) values ($1, $2, $3, $4, $5, $6, $7) RETURNING id;',
                             [user.email, user.salt, user.hash, user.fullname, user.phone, stripe_id, user.plan]);

    query.on('row', (row) => {
      result = row;
    });
    query.on('end', () => {
      done();
      callback(null, result);
    });
  });
}

module.exports.getUser = getUser;
module.exports.setUser = setUser;
