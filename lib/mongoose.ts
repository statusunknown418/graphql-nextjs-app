import { connect, connection } from 'mongoose';

const singleConnection = {
  isConnected: 0,
};

export const dbConnection = async () => {
  if (singleConnection.isConnected) return;

  const db = await connect(process.env.MONGODB_URI);
  singleConnection.isConnected = db.connections[0].readyState;

  return db;
};

connection.on('error', (err) => {
  console.log(err);
});

connection.once('connected', () => {
  console.log('Successfully connected');
});
