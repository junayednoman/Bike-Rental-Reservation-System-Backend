import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { TLoginUser, TUser } from './auth.interface';
import { UserModel } from './auth.model';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

// create service for creating user into db
const createUserIntoDb = async (payload: TUser) => {
  const result = await UserModel.create(payload);
  return result;
};
const loginUser = async (payload: TLoginUser) => {
  const isUserExist = await UserModel.findOne({ email: payload.email }).select(
    '+password',
  );
  // check if a user exist with the email
  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No user found with this email!',
      'email',
    );
  }

  // check if password match
  const isPasswordMatch = await bcrypt.compare(
    payload?.password,
    isUserExist?.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  // generate jwt access token
  const jwtPayload = {
    email: isUserExist?.email,
    role: isUserExist?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: config.jwt_refresh_expires_in,
    },
  );

  return { accessToken, refreshToken, isUserExist };
};

// generate new access token by refresh token
const generateNewAccessToken = async (refreshToken: string) => {
  const { email, role } = jwt.verify(
    refreshToken,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  // check if a user exist with the email
  const isUserExist = await UserModel.findOne({ email, role });
  if (!isUserExist) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
  }

  const JwtPayload = {
    email,
    role,
  };

  const accessToken = jwt.sign(JwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  return { accessToken, isUserExist };
};

// get user profile with access token
const getProfileFromDb = async (token: string) => {
  const { email, role } = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;
  const user = await UserModel.findOne({ email, role });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  return user;
};

export const UserServices = {
  createUserIntoDb,
  loginUser,
  generateNewAccessToken,
  getProfileFromDb,
};
