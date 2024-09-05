import { Schema, model } from 'mongoose';
import { TBike } from './bike.interface';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';

const bikeSchema = new Schema<TBike>(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'image is required'],
    },
    description: { type: String, required: [true, 'description is required'] },
    pricePerHour: { type: Number, required: [true, 'price is required'] },
    isAvailable: { type: Boolean, default: true },
    cc: { type: String, required: [true, 'cc is required'] },
    year: { type: Number, required: [true, 'year is required'] },
    model: { type: String, required: [true, 'model is required'] },
    brand: { type: String, required: [true, 'brand is required'] },
  },
  { timestamps: true },
);

// check if bike already exist with the new given name
bikeSchema.pre('save', async function () {
  const isBikeExist = await BikeModel.findOne({ name: this?.name });
  if (isBikeExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'A bike is already exist with the name',
      'name',
    );
  }
});

// check bike existence before updating
bikeSchema.pre('findOneAndUpdate', async function () {
  const query = this.getQuery();
  const bike = await BikeModel.findOne(query);
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid bike id!');
  }
});

// throw error if no bike exist with the id
bikeSchema.pre('findOneAndDelete', async function () {
  const isBikeExist = await BikeModel.findOne(this.getQuery());
  if (!isBikeExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid bike id!', 'id');
  }
});

export const BikeModel = model<TBike>('bike', bikeSchema);
