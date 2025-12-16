import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object';
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ISetting>('Setting', settingSchema);