import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  isGuest: boolean;
  guestId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    isGuest: { type: Boolean, default: false },
    guestId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
