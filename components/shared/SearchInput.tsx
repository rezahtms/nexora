"use client";

import { Search, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  pending: boolean;
};

export default function SearchInput({ value, onChange, pending }: SearchInputProps) {
  return (
    <div className="w-full max-w-xl">
      <label className="sr-only" htmlFor="customer-search">
        Search customers by name
      </label>
      <InputGroup className="h-12 rounded-xl bg-card shadow-sm">
        <InputGroupAddon align="inline-start">
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          id="customer-search"
          placeholder="Search by customer name"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {pending ? (
          <InputGroupAddon align="inline-end">
            <Spinner />
            <span className="sr-only" role="status" aria-live="polite">
              Updating search
            </span>
          </InputGroupAddon>
        ) : null}
        {value ? (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Clear customer search"
              size="icon-xs"
              onClick={() => onChange("")}
            >
              <X aria-hidden="true" />
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </div>
  );
}
