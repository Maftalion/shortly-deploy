var path = require('path');
var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');


mongoose.connect(path.join(__dirname, '../db/shortly.mongoDB'));
var db = mongoose.connection;
var Schema = mongoose.Schema;

urlsSchema = new Schema ({
  id: ObjectId(true),
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  timeStamp: { type: Date, default: Date.now }
});

usersSchema = new Schema ({
  id: ObjectId(true),
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  timeStamp: { type: Date, default: Date.now }
});


usersSchema.pre('save', function(next) {
  var user = this;
  bcrypt.genSalt(10, function(err, salt) { 
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });

});

module.exports = { 
  Link: mongoose.model('Link', urlsSchema),
  User: mongoose.model('User', usersSchema),
  DB: db
};




// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });


