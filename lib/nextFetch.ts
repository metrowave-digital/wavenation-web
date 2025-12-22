// lib/nextFetch.ts

export type NextFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};
