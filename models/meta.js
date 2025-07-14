const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema({
  key: String,
  value: String,
});

module.exports = mongoose.model('Meta', metaSchema);
