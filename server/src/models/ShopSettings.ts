import mongoose, { Document, Schema } from 'mongoose';

export interface IShopSettings extends Document {
  shopName: string;
  phone: string;
  email: string;
  address: string;
  openTime: string;
  closeTime: string;
  preparationTime: number;
  isOpen: boolean;
  maintenanceMode: boolean;
  otpVerification: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shopSettingsSchema = new Schema<IShopSettings>({
  shopName: {
    type: String,
    default: 'Real Taste Takeaway'
  },
  phone: {
    type: String,
    default: '+91 9465520816'
  },
  email: {
    type: String,
    default: 'hello@realtastecafe.com'
  },
  address: {
    type: String,
    default: 'UpalHeri, Rajpura, Punjab 140401'
  },
  openTime: {
    type: String,
    default: '10:00'
  },
  closeTime: {
    type: String,
    default: '21:00'
  },
  preparationTime: {
    type: Number,
    default: 15
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  otpVerification: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IShopSettings>('ShopSettings', shopSettingsSchema);