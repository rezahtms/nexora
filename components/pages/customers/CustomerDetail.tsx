"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Building2, Mail, MapPin, Phone, RefreshCw, UserRoundX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import useBackToCustomersHref from "@/lib/hooks/useBackToCustomersHref";
import useCustomer from "@/lib/hooks/useCustomer";
import useCustomerId from "@/lib/hooks/useCustomerId";

function maskIdentifier(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  return `•••• ${value.slice(-4)}`;
}

function DetailItem({ label, value, icon }: { label: string; value?: string | number; icon?: ReactNode }) {
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

export default function CustomerDetail() {
  const id = useCustomerId();
  const backHref = useBackToCustomersHref();
  const customerQuery = useCustomer(id);
  const customer = customerQuery.data;
  const router = useRouter();

  if (customerQuery.isNotFound) {
    return (
      <Empty className="mt-8 border border-dashed py-14">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserRoundX aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Customer not found</EmptyTitle>
          <EmptyDescription>
            This customer may have been removed or the address may be incorrect.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => router.push(backHref)}>
            Back to customers
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (customerQuery.isLoading) {
    return (
      <div className="mt-10 flex min-h-32 items-center justify-center gap-3 text-sm font-medium text-muted-foreground" role="status" aria-live="polite">
        <Spinner />
        <span>Loading customer information</span>
      </div>
    );
  }

  if (customerQuery.isError || !customer) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertCircle aria-hidden="true" />
        <AlertTitle>We couldn&apos;t load this customer</AlertTitle>
        <AlertDescription className="mt-3">
          <p className="mb-3">Check your connection and try again.</p>
          <Button variant="outline" onClick={() => void customerQuery.refetch()}>
            <RefreshCw aria-hidden="true" data-icon="inline-start" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <Card className="border-border/80 shadow-sm" aria-labelledby="personal-heading">
        <CardHeader>
          <CardTitle id="personal-heading">Personal information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="detail-grid">
            <DetailItem label="First name" value={customer.firstName} />
            <DetailItem label="Last name" value={customer.lastName} />
            <DetailItem label="Maiden name" value={customer.maidenName} />
            <DetailItem label="Age" value={customer.age ? `${customer.age} years` : undefined} />
            <DetailItem label="Gender" value={customer.gender} />
            <DetailItem label="Date of birth" value={customer.birthDate} />
            <DetailItem label="Blood group" value={customer.bloodGroup} />
            <DetailItem label="Eye color" value={customer.eyeColor} />
            <DetailItem
              label="Hair"
              value={customer.hair ? `${customer.hair.color ?? ""} ${customer.hair.type ?? ""}`.trim() : undefined}
            />
            <DetailItem label="Height" value={customer.height ? `${customer.height} cm` : undefined} />
            <DetailItem label="Weight" value={customer.weight ? `${customer.weight} kg` : undefined} />
          </dl>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm" aria-labelledby="contact-heading">
        <CardHeader>
          <CardTitle id="contact-heading">Contact details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="detail-grid">
            <DetailItem label="Email" value={customer.email} icon={<Mail aria-hidden="true" />} />
            <DetailItem label="Phone" value={customer.phone} icon={<Phone aria-hidden="true" />} />
            <DetailItem label="Username" value={customer.username} />
            <DetailItem label="University" value={customer.university} />
            <DetailItem label="IP address" value={customer.ip} />
            <DetailItem label="Device" value={customer.userAgent} />
          </dl>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm" aria-labelledby="address-heading">
        <CardHeader>
          <CardTitle id="address-heading">Address</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="detail-grid">
            <DetailItem label="Street" value={customer.address.address} icon={<MapPin aria-hidden="true" />} />
            <DetailItem label="City" value={customer.address.city} />
            <DetailItem label="State" value={customer.address.state} />
            <DetailItem label="State code" value={customer.address.stateCode} />
            <DetailItem label="Postal code" value={customer.address.postalCode} />
            <DetailItem label="Country" value={customer.address.country} />
            <DetailItem
              label="Coordinates"
              value={
                customer.address.coordinates
                  ? `${customer.address.coordinates.lat ?? ""}, ${customer.address.coordinates.lng ?? ""}`
                  : undefined
              }
            />
          </dl>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm" aria-labelledby="company-heading">
        <CardHeader>
          <CardTitle id="company-heading">Company</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="detail-grid">
            <DetailItem label="Company" value={customer.company.name} icon={<Building2 aria-hidden="true" />} />
            <DetailItem label="Job title" value={customer.company.title} />
            <DetailItem label="Department" value={customer.company.department} />
            <DetailItem label="Office address" value={customer.company.address?.address} />
            <DetailItem label="Office city" value={customer.company.address?.city} />
            <DetailItem label="Office state" value={customer.company.address?.state} />
            <DetailItem label="Office postal code" value={customer.company.address?.postalCode} />
            <DetailItem label="Office country" value={customer.company.address?.country} />
          </dl>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm md:col-span-2" aria-labelledby="additional-heading">
        <CardHeader>
          <CardTitle id="additional-heading">Additional information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="detail-grid sm:grid-cols-3">
            <DetailItem label="Role" value={customer.role} />
            <DetailItem label="Employee identifier" value={customer.ein} />
            <DetailItem label="SSN (masked)" value={maskIdentifier(customer.ssn)} />
            <DetailItem label="Network address" value={customer.macAddress} />
            <DetailItem label="Bank card type" value={customer.bank?.cardType} />
            <DetailItem label="Card expiry" value={customer.bank?.cardExpire} />
            <DetailItem label="Bank currency" value={customer.bank?.currency} />
            <DetailItem label="Card number (masked)" value={maskIdentifier(customer.bank?.cardNumber)} />
            <DetailItem label="IBAN" value={customer.bank?.iban} />
            <DetailItem label="Cryptocurrency" value={customer.crypto?.coin} />
            <DetailItem label="Crypto wallet" value={customer.crypto?.wallet} />
            <DetailItem label="Crypto network" value={customer.crypto?.network} />
          </dl>
        </CardContent>
      </Card>

      <p className="sr-only" role="status" aria-live="polite">
        Customer information for {customer.firstName} {customer.lastName} is ready.
      </p>
    </div>
  );
}
