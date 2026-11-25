"use client";

import { useParams } from "next/navigation";
import { parseCustomerId } from "@/lib/utils/parseCustomerId";

export default function useCustomerId(): number | null {
  const params = useParams();
  return parseCustomerId(params.id);
}
