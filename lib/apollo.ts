// lib/apollo.ts

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_PAYLOAD_GRAPHQL_URL,
    fetch: fetch,
  }),
  cache: new InMemoryCache(),
});

// Export a function so each server component gets its own fresh client
export function getClient() {
  return client;
}
