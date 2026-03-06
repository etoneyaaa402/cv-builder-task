import { GraphQLClient } from "graphql-request";

const ENDPOINT =
    process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3001/api/graphql";

export const gqlClient = new GraphQLClient(ENDPOINT);

export function setAuthToken(token: string) {
    gqlClient.setHeader("Authorization", `Bearer ${token}`);
}

export function clearAuthToken() {
    gqlClient.setHeader("Authorization", "");
}

export function fetcher<TData, TVariables extends Record<string, unknown>>(
    query: string,
    variables?: TVariables,
) {
    return () => gqlClient.request<TData>(query, variables as Record<string, unknown>);
}
