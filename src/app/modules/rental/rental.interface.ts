import { Types } from 'mongoose';

export type TRental = {
  userId: Types.ObjectId;
  bikeId: Types.ObjectId;
  startTime: string;
  returnTime: string;
  totalCost: number;
  isReturned: boolean;
  isPaid: boolean;
  isAdvancePaid: boolean;
  advanceTransactionId: string;
  transactionId: string;
};
