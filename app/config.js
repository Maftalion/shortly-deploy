// var path = require('path');
var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
// mongoose.connect(path.join(__dirname, '../db/shortly.mongoDB'));
var url = 'mongodb://localhost/db';
var connection = mongoose.createConnection(url);
mongoose.connect(url);
var db = mongoose.connection;
var Schema = mongoose.Schema;

db.on('error', console.error);
db.once('open', function() {
  // we're connected!
  console.log('Connected!');
});

urlsSchema = new Schema ({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  timeStamp: { type: Date, default: Date.now }
});

usersSchema = new Schema ({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  timeStamp: { type: Date, default: Date.now }
});


usersSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

urlsSchema.pre('save', function(next) {
  var link = this;
  var shasum = crypto.createHash('sha1');
  shasum.update(link.url);
  link.code = shasum.digest('hex').slice(0, 5);
 
  next();
});
var User = mongoose.model('User', usersSchema);

User.comparePassword = function(candidatePassword, savedPassword, cb) {
  bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

module.exports = { 
  Link: mongoose.model('Link', urlsSchema),
  User: User,
  DB: db
};


