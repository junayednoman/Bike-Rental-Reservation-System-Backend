/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model } from 'mongoose';
import { TUser } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    phone: { type: String, required: true },
    address: { type: String },
    role: { type: String, enum: ['admin', 'user'], required: true },
  },
  { timestamps: true },
);

// hash user password
userSchema.pre('save', async function (next) {
  const isUserExist = await UserModel.findOne({ email: this.email });
  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'A user is already exist with this email!',
      'email',
    );
  }
  this.password = await bcrypt.hash(
    this.password,
    Number(config.hash_salt_rounds),
  );
  next();
});

export const UserModel = model<TUser>('user', userSchema);
