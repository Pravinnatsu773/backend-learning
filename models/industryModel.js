const mongoose = require("mongoose");

const industrySchema = new mongoose.Schema(
  {
  
    name: {
      type: String,
      required: [true, "Please provide industry name"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false,
      },

  },

  { versionKey: false }
);


industrySchema.pre(/^find/, function (next) {
    this.find({ isDeleted: false });
  
    next();
  });


const Industry = mongoose.model("Industry", industrySchema);

module.exports = Industry;