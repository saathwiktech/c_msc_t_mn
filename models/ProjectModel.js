const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  pid: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  clientDetails: {
    clientname: {
      type: String,
      required: true
    },
    clientnumber: {
      type: Number,
      required: true
    },
    clientaddress: {
      type: String,
      required: true
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
