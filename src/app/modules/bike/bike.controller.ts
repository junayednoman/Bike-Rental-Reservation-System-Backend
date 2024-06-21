import httpStatus from 'http-status';
import catchAsyncError from '../../utils/catchAsyncError';
import successResponse from '../../utils/successResponse';
import { BikeServices } from './bike.service';
import handleDataNotFound from '../../utils/dataNotFound';

const createBike = catchAsyncError(async (req, res) => {
  const data = req.body;
  const result = await BikeServices.createBikeIntoDb(data);
  successResponse(res, {
    message: 'Bike created successfully',
    status: httpStatus.CREATED,
    data: result,
  });
});

const getAllBikes = catchAsyncError(async (req, res) => {
  const result = await BikeServices.getAllBikesFromDb();
 handleDataNotFound(result, res);
  successResponse(res, {
    message: 'All bikes retrieved successfully',
    data: result,
  });
});

const updateBike = catchAsyncError(async (req, res) => {
  const updateDoc = req.body;
  const result = await BikeServices.updateBikeIntoDb(
    updateDoc,
    req?.params?.id,
  );
  successResponse(res, {
    message: 'Bike updated successfully',
    data: result,
  });
});

const deleteBike = catchAsyncError(async (req, res) => {
  const result = await BikeServices.deleteBikeFromDb(req?.params?.id);
  successResponse(res, {
    message: 'Bike deleted successfully',
    data: result,
  });
});

export const BikeControllers = {
  createBike,
  getAllBikes,
  updateBike,
  deleteBike,
};
