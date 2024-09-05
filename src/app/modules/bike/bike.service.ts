import QueryBuilder from '../../builder/QueryBuilder';
import { TBike } from './bike.interface';
import { BikeModel } from './bike.model';

export const BikeSearchableFields = ['name', 'brand', 'cc', 'price'];

const createBikeIntoDb = async (payload: TBike) => {
  const result = await BikeModel.create(payload);
  return result;
};

// get bike from db
const getAllBikesFromDb = async (query: Record<string, unknown>) => {
  const bikeQuery = new QueryBuilder(
    BikeModel.find().select('-createdAt -updatedAt -__v'),
    query,
  )
    .search(BikeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await bikeQuery.modelQuery;
  const meta = await bikeQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleBikeFromDb = async (id: string) => {
  const result = await BikeModel.findById(id);
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
  getSingleBikeFromDb,
  updateBikeIntoDb,
  deleteBikeFromDb,
};
