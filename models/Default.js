const mongoose = require("mongoose");

// Define the schema for each unit
const unitSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Unit name (e.g., SFT, CFT)
  value: { type: Number, default: 0 },   // Initial value for the unit
});

// Define the schema for each field
const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the field (e.g., foundation, painting)
  units: { 
    type: [unitSchema], 
    default: [
      { name: "SFT", value: 0 },
      { name: "CFT", value: 0 },
    ], 
  },
});

// Main schema for user data
const userFieldsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User collection
  fields: {
    type: [fieldSchema], // Array of fields
    default: [
      { name: "foundation", units: [{ name: "SFT", value: 0 }, { name: "CFT", value: 0 }] },
      { name: "painting", units: [{ name: "SFT", value: 0 }, { name: "CFT", value: 0 }] },
      { name: "centering", units: [{ name: "SFT", value: 0 }, { name: "CFT", value: 0 }] },
    ],
  },
});

// Create the model
const UserFields = mongoose.model("UserFields", userFieldsSchema);

module.exports = UserFields;
