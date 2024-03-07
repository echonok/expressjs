import { model, Schema } from 'mongoose';
import { MODELS } from './_models';

export interface IUser {
  name: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExp?: Date;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExp: {
    type: Date,
    required: false,
  },
});

export const UserModel = model<IUser>(MODELS.users, UserSchema);
