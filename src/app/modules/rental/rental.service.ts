import { JwtPayload } from 'jsonwebtoken';
import { TRental } from './rental.interface';
import { RentalModel } from './rental.model';
import { UserModel } from '../auth/auth.model';
import { Types } from 'mongoose';

const createRentalIntoDb = async (
  payload: TRental,
  decodedInfo: JwtPayload,
) => {
  const { email, role } = decodedInfo;
  const user = await UserModel.findOne({ email, role }).select('_id');
  const userId = user?._id as Types.ObjectId;
  payload.userId = userId;
  //   console.log(payload);
  const result = await RentalModel.create(payload);
  return result;
};

export const RentalServices = { createRentalIntoDb };
