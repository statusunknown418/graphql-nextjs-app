import { ApolloServer, gql } from 'apollo-server-express';
import express, { json } from 'express';
import cors from 'cors';
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { Context } from 'apollo-server-core';

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

function runMiddleware(req: NextApiRequest, res:NextApiResponse, fn:) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function gqlHandler() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (ctx: Context) => ctx,
  });
  const app = express();

  await server.start();
  app.use(cors());
  server.applyMiddleware({ path: '/graphql', app });

  // res.json(server);
  console.log(`🚀 Server ready at ${server.graphqlPath}`);
  // };
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
