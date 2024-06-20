import { TBike } from './bike.interface';
import { BikeModel } from './bike.model';

const createBikeIntoDb = async (payload: TBike) => {
  const result = await BikeModel.create(payload);
  return result;
};

// get bike from db
const getAllBikesFromDb = async () => {
  const result = await BikeModel.find().select('-createdAt -updatedAt -__v');
  return result;
};

const updateBikeIntoDb = async (payload: Partial<TBike>, id: string) => {
  const result = await BikeModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteBikeFromDb = async (id: string) => {
  const result = await BikeModel.findOneAndDelete({ _id: id }, { lean: true });
  return result;
};

export const BikeServices = {
  createBikeIntoDb,
  getAllBikesFromDb,
  updateBikeIntoDb,
  deleteBikeFromDb
};
