import Image from "next/image";
import type { Customer } from "@/lib/types/customer.types";

export default function CustomerAvatar({ customer, size = "md" }: { customer: Customer; size?: "sm" | "md" | "lg" }) {
  const dimensions = size === "lg" ? 88 : size === "sm" ? 40 : 48;
  const initials = `${customer.firstName.slice(0, 1)}${customer.lastName.slice(0, 1)}`.toUpperCase();
  const imageIsAllowed = isAllowedAvatarSource(customer.image);
  return imageIsAllowed ? (
    <Image className="rounded-full bg-muted object-cover" src={customer.image} alt={`Portrait of ${customer.firstName} ${customer.lastName}`} width={dimensions} height={dimensions} sizes={`${dimensions}px`} />
  ) : (
    <span className="grid shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary" style={{ width: dimensions, height: dimensions }} role="img" aria-label={`Portrait unavailable for ${customer.firstName} ${customer.lastName}`}>{initials}</span>
  );
}

function isAllowedAvatarSource(source: string): boolean {
  try {
    const url = new URL(source);
    return url.protocol === "https:" && ["dummyjson.com", "images.dummyjson.com", "robohash.org"].includes(url.hostname);
  } catch {
    return false;
  }
}
