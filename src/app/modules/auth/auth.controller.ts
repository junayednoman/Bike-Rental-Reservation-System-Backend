import successResponse from '../../utils/successResponse';
import catchAsyncError from '../../utils/catchAsyncError';
import handleDataNotFound from '../../utils/dataNotFound';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { AuthServices } from './auth.service';

const createUser = catchAsyncError(async (req, res) => {
  const userData = req.body;
  const result = await AuthServices.createUserIntoDb(userData);

  successResponse(res, {
    message: 'User registered successfully',
    status: 201,
    data: result,
  });
});

const loginUser = catchAsyncError(async (req, res) => {
  const userData = req.body;
  const result = await AuthServices.loginUser(userData);
  const { accessToken, refreshToken, user } = result;
  res.cookie('refreshToken', refreshToken);
  successResponse(
    res,
    {
      message: 'User logged in successfully',
      data: user,
    },
    accessToken,
  );
});

const generateNewAccessToken = catchAsyncError(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.generateNewAccessToken(refreshToken);
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
  const result = await AuthServices.getProfileFromDb(token as string);
  successResponse(res, {
    message: 'User profile retrieved successfully!',
    data: result,
  });
});

const updateUserProfile = catchAsyncError(async (req, res) => {
  const updateDoc = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
  }

  const token = authHeader.split(' ')[1];

  const result = await AuthServices.updateUserProfileIntoDb(updateDoc, token);
  handleDataNotFound(result, res);
  successResponse(res, {
    message: 'Profile updated successfully',
    data: result,
  });
});

const getAllUsers = catchAsyncError(async (req, res) => {
  const result = await AuthServices.getAllUsersFromDb();
  successResponse(res, {
    message: 'Users retrieved successfully!',
    data: result,
  });
});

const deleteUser = catchAsyncError(async (req, res) => {
  const result = await AuthServices.deleteUserFromDb(req.params.id);
  successResponse(res, {
    message: 'Users deleted successfully!',
    data: result,
  });
});

const updateUserRole = catchAsyncError(async (req, res) => {
  const result = await AuthServices.updateUserRole(req.params.id);
  successResponse(res, {
    message: 'Users role updated successfully!',
    data: result,
  });
});

export const AuthController = {
  createUser,
  loginUser,
  generateNewAccessToken,
  getProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUserRole,
};
