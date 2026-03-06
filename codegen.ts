import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "http://localhost:3001/api/graphql",
    documents: ["src/**/*.graphql", "src/**/*.tsx"],
    ignoreNoDocuments: true,
    generates: {
        "./src/generated/graphql.ts": {
            plugins: ["typescript", "typescript-operations", "typescript-react-query"],
            config: {
                withHooks: true,
                fetcher: {
                    endpoint: "http://localhost:3001/api/graphql",
                },
            },
        },
    },
};

export default config;
