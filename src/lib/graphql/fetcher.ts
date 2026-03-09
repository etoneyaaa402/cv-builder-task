import { GraphQLClient } from "graphql-request";

// All client-side GraphQL requests are routed through the Next.js proxy at
// /api/graphql. The proxy reads the iron-session cookie server-side and
// injects the Authorization header before forwarding to the backend.
// This keeps tokens off the client entirely.
const gqlClient = new GraphQLClient("/api/graphql");

export function fetcher<TData, TVariables extends Record<string, unknown>>(
    query: string,
    variables?: TVariables,
) {
    return () => gqlClient.request<TData>(query, variables as Record<string, unknown>);
}
