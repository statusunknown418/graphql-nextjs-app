import { ApolloServer, gql } from 'apollo-server-micro';
import Cors from 'micro-cors';
import { dbConnection } from '../../lib/mongoose';
import { UserModel } from '../../models/User';

dbConnection();

const cors = Cors();

const apolloServer = new ApolloServer({
  typeDefs: gql`
    type User {
      _id: ID!
      name: String!
      email: String
    }

    type Query {
      getAllUsers: [User]
    }
    type Mutation {
      createUser(name: String!, email: String!): User
    }
  `,
  resolvers: {
    Query: {
      getAllUsers: async () => await UserModel.find(),
    },
    Mutation: {
      createUser: async (
        _: unknown,
        { name, email }: { name: string; email: string }
      ) => {
        const newUser = new UserModel({
          name,
          email,
        });

        await newUser.save();

        return newUser;
      },
    },
  },
});

// * Storing the start on a constant will solve the error ->
// ! error - Error: called start() with surprising state started

const start = apolloServer.start();

export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await start;

  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
