const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  body: {
    type: String,
    trim: true,
    required: true
  },
  slug: {
    type: String,
    trim: true,
    unique: true ,
  },
  pub: {
    type: String,
    default: 'draft',
    enum: ['draft','unpublish', 'publish'],
  },
  source: {
    type: String,
    trim: true,
  },
  tags: [{ type: String }],
  
  image : [{ type: String}],
  createdAt: {
    type: Date,
    default: Date.now()
  }
  
});

// export model Blog with BlogSchema
module.exports = mongoose.model("Blog", BlogSchema);

