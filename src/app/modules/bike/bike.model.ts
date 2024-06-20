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
    description: { type: String, required: [true, 'description is required'] },
    pricePerHour: { type: Number, required: [true, 'price is required'] },
    isAvailable: { type: Boolean, default: true },
    cc: { type: Number, required: [true, 'cc is required'] },
    year: { type: Number, required: [true, 'year is required'] },
    model: { type: String, required: [true, 'model is required'] },
    brand: { type: String, required: [true, 'brand is required'] },
  },
  { timestamps: true },
);

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

bikeSchema.post('find', async function (docs) {
  if (docs.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No bike found!');
  }
});

export const BikeModel = model<TBike>('bike', bikeSchema);
