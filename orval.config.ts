import { defineConfig } from "orval";

export default defineConfig({
  dummyjson: {
    input: "./openapi/dummyjson-users.yaml",
    output: {
      mode: "tags-split",
      target: "./lib/api/generated",
      schemas: "./lib/api/generated/model",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      override: {
        mutator: {
          path: "./lib/api/axios-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
});
