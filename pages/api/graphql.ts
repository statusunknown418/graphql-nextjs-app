import { ApolloServer, GetMiddlewareOptions, gql } from 'apollo-server-express';
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
    hello: String
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    hello: () => 'Hello World',
  },
};

const runMiddleware = <T = NextApiRequest, G = NextApiResponse>(
  req: T,
  res: G,
  fn: (req: T, res: G, fn: (args: any) => any) => void
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (ctx: Context) => ctx,
});

const started = server.start();

export default async function gqlHandler(req: any, res: any) {
  await started;

  const appMiddleware = server.getMiddleware({
    path: '/api/graphql',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  await runMiddleware(req, res, appMiddleware);

  console.log(`🚀 Server ready at ${server.graphqlPath}`);
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
