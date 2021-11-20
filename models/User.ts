import { model, models, Schema } from 'mongoose';
export interface IUserModel {
  _id: string;
  name: string;
  email: string;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

export const UserModel = models.User || model('User', userSchema);
