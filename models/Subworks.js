// const mongoose = require('mongoose');

// const subworkSchema = new mongoose.Schema({
//   wid: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Work',
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },

//   length: {
//     type: Number,
//     default: 0
//   },
//   breadth: {
//     type: Number,
//     default: 0
//   },
//   depth: {
//     type: Number,
//     default: 0
//   },
//   default: {
//     type: Number,
//     default: 0
//   }
// });
// const Subwork = mongoose.model('Subwork', subworkSchema);

// module.exports = Subwork;
const mongoose = require('mongoose');

const subworkSchema = new mongoose.Schema({
  wid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Work',
    required: true
  },
  name: {
    type: String,
    required: true
  },

  default: {
    SFT: {
      type: Number,
      default: 0
    },
    CFT: {
      type: Number,
      default: 0
    }
  },
  details: [
    {
      id: {
        type: String,
      },
      name: {
        type: String,
        default: ''
      },
      length: {
        type: Number,
        default: 0
      },
      breadth: {
        type: Number,
        default: 0
      },
      depth: {
        type: Number,
        default: 0
      },
      number: {
        type: Number,
        default: 1
      },
      quantity: {
        type: Number,
        default: 0
      }
    }
  ],
  reductions:[
    {
      id: {
        type: String,
      },
      name: {
        type: String,
        default: ''
      },
      length: {
        type: Number,
        default: 0
      },
      breadth: {
        type: Number,
        default: 0
      },
      depth: {
        type: Number,
        default: 0
      },
      number: {
        type: Number,
        default: 1
      },
      quantity: {
        type: Number,
        default: 0
      }
    }
  ]
});

const Subwork = mongoose.model('Subwork', subworkSchema);

module.exports = Subwork;
