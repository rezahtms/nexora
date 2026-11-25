"use client";

import { LoaderCircle, Search, X } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function SearchInput({ value, onChange, pending }: { value: string; onChange: (value: string) => void; pending: boolean }) {
  return (
    <div className="relative w-full max-w-xl">
      <label className="sr-only" htmlFor="customer-search">Search customers by name</label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input id="customer-search" className="h-14 rounded-xl bg-card pl-12 pr-12 text-base shadow-sm" placeholder="Search by customer name" autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} />
      {pending ? <span className={`absolute top-1/2 -translate-y-1/2 text-primary ${value ? "right-12" : "right-4"}`} role="status" aria-live="polite"><LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" /><span className="sr-only">Updating search</span></span> : null}
      {value ? <Button className="absolute right-2 top-1/2 size-11 -translate-y-1/2" size="icon" variant="ghost" aria-label="Clear customer search" onClick={() => onChange("")}><X aria-hidden="true" /></Button> : null}
    </div>
  );
}
