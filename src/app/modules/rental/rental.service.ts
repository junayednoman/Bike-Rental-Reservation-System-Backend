/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { TRental } from './rental.interface';
import { RentalModel } from './rental.model';
import { UserModel } from '../auth/auth.model';
import mongoose, { Types } from 'mongoose';
import { BikeModel } from '../bike/bike.model';
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';

const createRentalIntoDb = async (
  payload: TRental,
  decodedInfo: JwtPayload,
) => {
  const { email, role } = decodedInfo;
  const user = await UserModel.findOne({ email, role }).select('_id');
  const userId = user?._id as Types.ObjectId;
  payload.userId = userId;
  const result = await RentalModel.create(payload);
  return result;
};

const returnBike = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // set return time
    const currentTime = new Date();
    const returnTime = currentTime.toISOString().split('.')[0] + 'Z';

    const rental = await RentalModel.findOne({ _id: id }).select(
      'startTime bikeId',
    );

    if (!rental) {
      throw new AppError(httpStatus.NOT_FOUND, 'Invalid rental ID!', 'id');
    }

    // throw error if bike is not available
    const bike = await BikeModel.findOne({ _id: rental.bikeId });
    if (!bike) {
      throw new AppError(httpStatus.NOT_FOUND, 'Invalid bike ID!', 'id');
    }

    // calculate cost based on time
    const startTime = new Date(rental?.startTime) as any;
    const timeDifference = (new Date(returnTime) as any) - startTime;
    const totalHours = timeDifference / (1000 * 60 * 60);

    const totalCost = bike.pricePerHour * totalHours;
    const updateDoc = {
      isReturned: true,
      returnTime,
      totalCost: totalCost.toFixed(2),
    };
    const result = await RentalModel.findOneAndUpdate({ _id: id }, updateDoc, {
      new: true,
      session,
    });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update rental!');
    }

    // update bike availability
    await BikeModel.findOneAndUpdate(
      { _id: rental.bikeId },
      { isAvailable: true },
      { session },
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

const getAllRentalsFromDb = async (decoded: JwtPayload) => {
  const { email, role } = decoded;
  const user = await UserModel.findOne({ email, role });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
  }

  const result = await RentalModel.find({ userId: user?._id });
  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No rentals found for this user!');
  }
  return result;
};

export const RentalServices = {
  createRentalIntoDb,
  returnBike,
  getAllRentalsFromDb,
};
