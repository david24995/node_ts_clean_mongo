import { Schema, model } from 'mongoose';

const productoSchema = new Schema({

  name: {
    type: String,
    require: [true, "name is required"],
    unique: true
  },
  available: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    require: true
  }
});

productoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret, options) {
    delete ret._id;
  }
})

export const ProductModel = model('Product', productoSchema);