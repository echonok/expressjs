import { model, Schema } from 'mongoose';
import { MODELS } from './_models';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserWithId extends IUser {
  id: string;
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
});

export const UserModel = model<IUser>(MODELS.users, UserSchema);
