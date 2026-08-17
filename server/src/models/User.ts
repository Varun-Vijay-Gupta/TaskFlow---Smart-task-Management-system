import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  isGuest: boolean;
  guestId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    password: { type: String, select: false },
    isGuest: { type: Boolean, default: false },
    guestId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
