import { Schema, model, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: Schema.Types.ObjectId | null;
  level: number;
  path: string[];
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxLength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 5 // Maximum 5 levels of nesting
  },
  path: [{
    type: String,
    required: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Prevent deletion if category has subcategories
categorySchema.pre('deleteOne', { document: true, query: false }, async function(this: Document & ICategory, next: Function) {
  const hasChildren = await this.model('Category').exists({ parentId: this._id });
  if (hasChildren) {
    next(new Error('Cannot delete category with subcategories'));
    return;
  }
  next();
});

// Indexes for better query performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });
categorySchema.index({ path: 1 });
categorySchema.index({ level: 1 });

// Pre-save middleware to create path
categorySchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('parentId')) {
    try {
      if (!this.parentId) {
        this.path = [this.slug];
        this.level = 1;
      } else {
        const parent = await this.model('Category').findById(this.parentId);
        if (!parent) {
          throw new Error('Parent category not found');
        }
  // Use fallback logic below
  const parentObj: any = parent.toObject?.() ?? parent;
  this.path = [...(parentObj?.path ?? []), this.slug];
  this.level = (parentObj?.level ?? 1) + 1;
      }
    } catch (error) {
      next(error as Error);
    }
  }
  next();
});

// Method to get full category path name
categorySchema.methods.getFullPath = function(): string {
  return this.path.join(' > ');
};

// Static method to get all subcategories
categorySchema.statics.getAllSubcategories = async function(categoryId: Schema.Types.ObjectId) {
  return this.find({
    path: { $regex: categoryId.toString() }
  }).sort({ level: 1 });
};

// (Removed duplicate 'remove' hook. Use only 'deleteOne' hook above.)

const Category = model<ICategory>('Category', categorySchema);
export default Category;
