import { cache } from "react";
import { makeQueryClient } from "@/lib/providers/query-client";

export const getQueryClient = cache(makeQueryClient);
