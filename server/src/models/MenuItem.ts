import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category: 'Coffee' | 'Snacks' | 'Desserts';
  imageURL: string;
  isAvailable: boolean;
  preparationTime: number;
  createdAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Coffee', 'Snacks', 'Desserts']
  },
  imageURL: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    required: [true, 'Please add preparation time in minutes'],
    min: [1, 'Preparation time must be at least 1 minute']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
