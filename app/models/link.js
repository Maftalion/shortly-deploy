var db = require('../config');
var crypto = require('crypto');

var Link = mongoose.model('url', db.urlsSchema);

// {
//   tableName: 'urlsSchema',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('urlsSchema'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;
