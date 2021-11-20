import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnection } from '../../lib/mongoose';
import { UserModel } from '../../models/User';

dbConnection();

const rest = async (req: NextApiRequest, res: NextApiResponse) => {
  // get the data from the request
  const { name, email } = req.body;

  if (req.method === 'DELETE') {
    // delete the user
    const user = await UserModel.findOneAndDelete({ email });

    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      message: 'User deleted',
      user,
    });
  }

  // validate the data
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'Name is required',
    });
  }

  const allUsers = await UserModel.find();

  // store the data in the database
  const verifyUser = await UserModel.findOne({ email });

  if (verifyUser) {
    return res.status(400).json({
      status: 'error',
      message: 'User already exists, your email must be unique',
    });
  }

  const newUser = new UserModel({
    name,
    email,
  });

  await newUser.save();

  return res.status(200).json({ allUsers, newUser });
};
export default rest;
