import { UserServices } from './auth.service';
import successResponse from '../../utils/successResponse';
import catchAsyncError from '../../utils/catchAsyncError';
import handleDataNotFound from '../../utils/dataNotFound';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';

const createUser = catchAsyncError(async (req, res) => {
  const userData = req.body;
  const result = await UserServices.createUserIntoDb(userData);
  result.password = '';
  successResponse(res, {
    message: 'User registered successfully!',
    status: 201,
    data: result,
  });
});

const loginUser = catchAsyncError(async (req, res) => {
  const userData = req.body;
  const result = await UserServices.loginUser(userData);
  const { accessToken, refreshToken, isUserExist } = result;
  isUserExist.password = '';
  res.cookie('refreshToken', refreshToken);
  successResponse(
    res,
    {
      message: 'User logged in successfully!',
      data: isUserExist,
    },
    accessToken,
  );
});

const generateNewAccessToken = catchAsyncError(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await UserServices.generateNewAccessToken(refreshToken);
  successResponse(
    res,
    {
      message: 'Access token generated successfully!',
      data: result.isUserExist,
    },
    result.accessToken,
  );
});

const getProfile = catchAsyncError(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
  }

  const token = authHeader.split(' ')[1];
  const result = await UserServices.getProfileFromDb(token as string);
  successResponse(res, {
    message: 'User profile retrieved successfully!',
    data: result,
  });
});

const updateUserProfile = catchAsyncError(async (req, res) => {
  const updateDoc = req.body;
  const token = req.headers.authorization as string;
  const result = await UserServices.updateUserProfileIntoDb(updateDoc, token);
  handleDataNotFound(result, res);
  successResponse(res, {
    message: 'Profile updated successfully!',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  loginUser,
  generateNewAccessToken,
  getProfile,
  updateUserProfile,
};
