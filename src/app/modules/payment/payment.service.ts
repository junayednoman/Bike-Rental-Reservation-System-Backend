/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
export const BikeSearchableFields = ['name', 'brand', 'cc', 'price'];

const createRentalIntoDb = async (
  payload: TRental,
  decodedInfo: JwtPayload,
) => {
  
};


export const RentalServices = {
  createRentalIntoDb,
};
