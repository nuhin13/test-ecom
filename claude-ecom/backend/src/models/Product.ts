import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  specifications?: Record<string, string>;
  category: string;
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  images: string[];
  video?: string;
  stock: number;
  isAvailable: boolean;
  deliveryEstimate: {
    min: number;
    max: number;
    unit: 'days' | 'weeks';
  };
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: 'text',
    },
    description: {
      type: String,
      required: true,
      index: 'text',
    },
    specifications: {
      type: Map,
      of: String,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    video: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    deliveryEstimate: {
      min: {
        type: Number,
        required: true,
        default: 3,
      },
      max: {
        type: Number,
        required: true,
        default: 7,
      },
      unit: {
        type: String,
        enum: ['days', 'weeks'],
        default: 'days',
      },
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1 });

// Calculate discount percentage before saving
productSchema.pre('save', function (next) {
  if (this.discountedPrice && this.price) {
    this.discountPercentage = Math.round(
      ((this.price - this.discountedPrice) / this.price) * 100
    );
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
