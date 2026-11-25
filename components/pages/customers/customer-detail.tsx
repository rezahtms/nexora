"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import EmptyState from "@/components/shared/empty-state";
import ErrorState from "@/components/shared/error-state";
import Loader from "@/components/shared/loader";
import useBackToCustomersHref from "@/lib/hooks/use-back-to-customers-href";
import useCustomer from "@/lib/hooks/use-customer";
import useCustomerId from "@/lib/hooks/use-customer-id";

export default function CustomerDetail() {
  const id = useCustomerId();
  const backHref = useBackToCustomersHref();
  const customerQuery = useCustomer(id);
  const customer = customerQuery.data;
  const router = useRouter();

  if (customerQuery.isNotFound) {
    return (
      <EmptyState
        title="Customer not found"
        description="This customer may have been removed or the address may be incorrect."
        actionLabel="Back to customers"
        onAction={() => router.push(backHref)}
      />
    );
  }
  if (customerQuery.isLoading) return <Loader label="Loading customer information" />;
  if (customerQuery.isError || !customer) {
    return (
      <ErrorState
        title="We couldn't load this customer"
        onRetry={() => void customerQuery.refetch()}
      />
    );
  }

  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6" aria-labelledby="personal-heading">
        <h2 className="text-lg font-semibold" id="personal-heading">Personal information</h2>
        <dl className="detail-grid mt-4">
          {renderDetail("First name", customer.firstName)}
          {renderDetail("Last name", customer.lastName)}
          {renderDetail("Maiden name", customer.maidenName)}
          {renderDetail("Age", customer.age ? `${customer.age} years` : undefined)}
          {renderDetail("Gender", customer.gender)}
          {renderDetail("Date of birth", customer.birthDate)}
          {renderDetail("Blood group", customer.bloodGroup)}
          {renderDetail("Eye color", customer.eyeColor)}
          {renderDetail("Hair", customer.hair ? `${customer.hair.color ?? ""} ${customer.hair.type ?? ""}`.trim() : undefined)}
          {renderDetail("Height", customer.height ? `${customer.height} cm` : undefined)}
          {renderDetail("Weight", customer.weight ? `${customer.weight} kg` : undefined)}
        </dl>
      </section>
      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6" aria-labelledby="contact-heading">
        <h2 className="text-lg font-semibold" id="contact-heading">Contact details</h2>
        <dl className="detail-grid mt-4">
          {renderDetail("Email", customer.email, <Mail aria-hidden="true" />)}
          {renderDetail("Phone", customer.phone, <Phone aria-hidden="true" />)}
          {renderDetail("Username", customer.username)}
          {renderDetail("University", customer.university)}
          {renderDetail("IP address", customer.ip)}
          {renderDetail("Device", customer.userAgent)}
        </dl>
      </section>
      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6" aria-labelledby="address-heading">
        <h2 className="text-lg font-semibold" id="address-heading">Address</h2>
        <dl className="detail-grid mt-4">
          {renderDetail("Street", customer.address.address, <MapPin aria-hidden="true" />)}
          {renderDetail("City", customer.address.city)}
          {renderDetail("State", customer.address.state)}
          {renderDetail("State code", customer.address.stateCode)}
          {renderDetail("Postal code", customer.address.postalCode)}
          {renderDetail("Country", customer.address.country)}
          {renderDetail(
            "Coordinates",
            customer.address.coordinates
              ? `${customer.address.coordinates.lat ?? ""}, ${customer.address.coordinates.lng ?? ""}`
              : undefined,
          )}
        </dl>
      </section>
      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6" aria-labelledby="company-heading">
        <h2 className="text-lg font-semibold" id="company-heading">Company</h2>
        <dl className="detail-grid mt-4">
          {renderDetail("Company", customer.company.name, <Building2 aria-hidden="true" />)}
          {renderDetail("Job title", customer.company.title)}
          {renderDetail("Department", customer.company.department)}
          {renderDetail("Office address", customer.company.address?.address)}
          {renderDetail("Office city", customer.company.address?.city)}
          {renderDetail("Office state", customer.company.address?.state)}
          {renderDetail("Office postal code", customer.company.address?.postalCode)}
          {renderDetail("Office country", customer.company.address?.country)}
        </dl>
      </section>
      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6 md:col-span-2" aria-labelledby="additional-heading">
        <h2 className="text-lg font-semibold" id="additional-heading">Additional information</h2>
        <dl className="detail-grid mt-4 sm:grid-cols-3">
          {renderDetail("Role", customer.role)}
          {renderDetail("Employee identifier", customer.ein)}
          {renderDetail("SSN (masked)", maskIdentifier(customer.ssn))}
          {renderDetail("Network address", customer.macAddress)}
          {renderDetail("Bank card type", customer.bank?.cardType)}
          {renderDetail("Card expiry", customer.bank?.cardExpire)}
          {renderDetail("Bank currency", customer.bank?.currency)}
          {renderDetail("Card number (masked)", maskIdentifier(customer.bank?.cardNumber))}
          {renderDetail("IBAN", customer.bank?.iban)}
          {renderDetail("Cryptocurrency", customer.crypto?.coin)}
          {renderDetail("Crypto wallet", customer.crypto?.wallet)}
          {renderDetail("Crypto network", customer.crypto?.network)}
        </dl>
      </section>
      <p className="sr-only" role="status" aria-live="polite">
        Customer information for {customer.firstName} {customer.lastName} is ready.
      </p>
    </div>
  );
}

function maskIdentifier(value?: string): string | undefined {
  if (!value) return undefined;
  return `•••• ${value.slice(-4)}`;
}

function renderDetail(label: string, value?: string | number, icon?: ReactNode) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium">{value || "Not provided"}</dd>
    </div>
  );
}
