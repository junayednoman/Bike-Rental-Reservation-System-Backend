import httpStatus from 'http-status';
import catchAsyncError from '../../utils/catchAsyncError';
import successResponse from '../../utils/successResponse';
import { BikeServices } from './bike.service';

const createBike = catchAsyncError(async (req, res) => {
  const data = req.body;
  const result = await BikeServices.createBikeIntoDb(data);
  successResponse(res, {
    message: 'Bike created successfully',
    status: httpStatus.CREATED,
    data: result,
  });
});

export const BikeControllers = { createBike };
