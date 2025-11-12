import mongoose, { Document, Schema } from 'mongoose';

export interface ISlider extends Document {
  title: string;
  description?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sliderSchema = new Schema<ISlider>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering
sliderSchema.index({ order: 1, isActive: 1 });

export const Slider = mongoose.model<ISlider>('Slider', sliderSchema);
