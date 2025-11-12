import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: mongoose.Types.ObjectId;
  stock: number;
  images: string[];
  video?: string;
  specs: Record<string, string>;
  ratings: {
    average: number;
    count: number;
  };
  deliveryEstimateDays: number;
  isAvailable: boolean;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String, required: true }],
  video: { type: String },
  specs: { type: Map, of: String },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  deliveryEstimateDays: { type: Number, default: 3 },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
