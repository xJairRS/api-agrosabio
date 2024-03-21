const { Schema, model } = require('mongoose');
const Role = require('./Role'); 

const userSchema = new Schema({
  name: String,
  lastname: String,
  email: String,
  password: String,
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = model('User', userSchema);
