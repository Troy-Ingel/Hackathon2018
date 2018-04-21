var mongoose = require('mongoose');

module.exports = mongoose.model('User', mongoose.Schema({
  	name:{
  		type: String,
  		required: true
  	},
  	first_score:{
  		type: String,
  	},
    latest_score:{
      type: String,
    }
}));
