import { GraphQLClient } from "graphql-request";

const gqlClient = new GraphQLClient("/api/graphql");

export function fetcher<TData, TVariables extends Record<string, unknown>>(
    query: string,
    variables?: TVariables,
) {
    return () => gqlClient.request<TData>(query, variables as Record<string, unknown>);
}
