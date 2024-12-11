const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  wid: {
    type: String,
    required: true
  },
  sft:{
    type:Number,
    default:0
  },cft:{
    type:Number,
    default:0
  },
  name: {
    type: String,
    required: true
  },
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
});
const Work = mongoose.model('Work', workSchema);

module.exports = Work;