import { Schema, model, Document } from 'mongoose';

interface ICartItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  name: string;
}

interface ICart extends Document {
  user: Schema.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  totalItems: number;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    name: {
      type: String,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
cartSchema.index({ user: 1 });

// Method to calculate totals
cartSchema.pre('save', function(next) {
  if (this.items) {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalAmount = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  next();
});

const Cart = model<ICart>('Cart', cartSchema);
export default Cart;
