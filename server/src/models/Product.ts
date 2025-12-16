import { Schema, model } from 'mongoose';

import { Types } from 'mongoose';

interface IReview {
  rating: number;
  comment: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  isAvailable: boolean;
  featured: boolean;
  reviews: IReview[];
  numOfReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please select category'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  reviews: [{
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxLength: [500, 'Comment cannot exceed 500 characters']
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  numOfReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
productSchema.index({ name: 'text', category: 1 });
productSchema.index({ isAvailable: 1, featured: 1 });

// Add calculateAverageRating method after schema declaration
productSchema.methods.calculateAverageRating = async function() {
  if (this.reviews.length === 0) {
    this.numOfReviews = 0;
    return;
  }
  const avg = this.reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / this.reviews.length;
  this.numOfReviews = this.reviews.length;
  await this.save();
  return avg;
};

const Product = model<IProduct>('Product', productSchema);
export default Product;
