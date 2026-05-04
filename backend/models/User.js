const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    default: null
  },
  height: {
    type: Number,
    default: null
  },
  age: {
    type: Number,
    default: null
  },
  fitnessGoal: {
    type: String,
    default: 'General Fitness'
  }
}, { timestamps: true });

// Pre-save middleware to hash the password
// Note: In Mongoose 7+, async pre hooks do NOT receive `next`.
// Simply return or throw to signal completion or failure.
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
