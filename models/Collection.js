var mongoose = require('mongoose');

module.exports = mongoose.model('Collection', mongoose.Schema({
  	attr1:{
  		type: String,
  		required: true
  	},
  	attr2:{
  		type: String,
  		index: true,
  		unique : true,
		required: true
  	}
}));
