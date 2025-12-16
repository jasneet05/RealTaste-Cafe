import { Schema, model, Document } from 'mongoose';

interface IAdminSettings extends Document {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessHours: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  minimumOrderAmount: number;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  updatedBy: Schema.Types.ObjectId;
  updatedAt: Date;
}

const adminSettingsSchema = new Schema<IAdminSettings>({
  storeName: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true
  },
  storeEmail: {
    type: String,
    required: [true, 'Store email is required'],
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email']
  },
  storePhone: {
    type: String,
    required: [true, 'Store phone is required']
  },
  storeAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  businessHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    open: {
      type: String,
      required: true
    },
    close: {
      type: String,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: true
    }
  }],
  taxRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  shippingFee: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  freeShippingThreshold: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  minimumOrderAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const AdminSettings = model<IAdminSettings>('AdminSettings', adminSettingsSchema);
export default AdminSettings;
