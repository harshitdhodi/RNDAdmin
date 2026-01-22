
const mongoose = require('mongoose');

const textSliderItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
    default: '',
  },
});

// Ensure _id is mapped to id for frontend compatibility
textSliderItemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const textSliderSchema = new mongoose.Schema(
  {
    items: [textSliderItemSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

textSliderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model('TextSlider', textSliderSchema);
