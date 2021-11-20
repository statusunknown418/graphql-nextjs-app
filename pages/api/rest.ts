import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnection } from 'lib/mongoose';
import { UserModel } from 'models/User';

dbConnection();

const rest = async (req: NextApiRequest, res: NextApiResponse) => {
  // get the data from the request
  const { name, email } = req.body;

  // validate the data
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'Name is required',
    });
  }

  // store the data in the database
  const allUsers = await UserModel.find();

  const newUser = new UserModel({
    name,
    email,
  });

  await newUser.save();

  return res.status(200).json({ allUsers, newUser });
};
export default rest;
