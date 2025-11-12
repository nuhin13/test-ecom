import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  payment: {
    method: string;
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
  };
  trackingNumber?: string;
}

const OrderSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String },
    },
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  payment: {
    method: { type: String, default: 'mock' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: { type: String },
  },
  trackingNumber: { type: String },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
