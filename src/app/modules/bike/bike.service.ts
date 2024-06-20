import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { TBike } from './bike.interface';
import { BikeModel } from './bike.model';

const createBikeIntoDb = async (payload: TBike) => {
  // throw new AppError(httpStatus.BAD_REQUEST, 'bad request!');
  const result = await BikeModel.create(payload);
  return result;
};

export const BikeServices = { createBikeIntoDb };
