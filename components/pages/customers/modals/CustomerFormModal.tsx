"use client";

import { useCallback, useMemo, useState, type ReactElement } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import Modal from "@/components/shared/Modal";
import InputField from "@/components/shared/form/InputField";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { Button } from "@/components/ui/button";
import useCreateCustomer from "@/lib/hooks/useCreateCustomer";
import useUpdateCustomer from "@/lib/hooks/useUpdateCustomer";
import type { Customer, CustomerInput } from "@/lib/types/customer.types";
import {
  customerSchema,
  type CustomerFormValues,
  type ValidCustomerFormValues,
} from "@/lib/validations/customer.schema";

type CustomerFormModalProps = {
  trigger: ReactElement;
  customer?: Customer;
  onSuccess?: () => void;
};

function formatDateForInput(value?: string): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

function getDefaultValues(customer?: Customer): CustomerFormValues {
  return {
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    company: {
      name: customer?.company.name ?? "",
      title: customer?.company.title ?? "",
      department: customer?.company.department ?? "",
      address: customer?.company.address,
    },
    age: customer?.age ?? 18,
    gender: customer?.gender ?? "",
    maidenName: customer?.maidenName ?? "",
    birthDate: formatDateForInput(customer?.birthDate),
    image: customer?.image ?? "",
    address: {
      address: customer?.address.address ?? "",
      city: customer?.address.city ?? "",
      state: customer?.address.state ?? "",
      stateCode: customer?.address.stateCode ?? "",
      postalCode: customer?.address.postalCode ?? "",
      country: customer?.address.country ?? "",
    },
  };
}

export default function CustomerFormModal({ trigger, customer, onSuccess }: CustomerFormModalProps) {
  const [open, setOpen] = useState(false);
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const values = useMemo(() => getDefaultValues(customer), [customer]);

  const form = useForm<CustomerFormValues, unknown, ValidCustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: values,
    values,
  });

  const isSubmitting = form.formState.isSubmitting || createCustomer.isPending || updateCustomer.isPending;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        form.reset(getDefaultValues(customer));
      }
    },
    [customer, form],
  );

  const onSubmit: SubmitHandler<ValidCustomerFormValues> = useCallback(
    async (data) => {
      const input: CustomerInput = data;
      if (customer) {
        await updateCustomer.mutateAsync({ id: customer.id, input });
      } else {
        await createCustomer.mutateAsync(input);
      }
      setOpen(false);
      form.reset(getDefaultValues(undefined));
      onSuccess?.();
    },
    [createCustomer, customer, form, onSuccess, updateCustomer],
  );

  return (
    <Modal
      trigger={trigger}
      title={customer ? "Edit customer" : "Add customer"}
      description="Keep the customer record accurate and up to date."
      open={open}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="sr-only">Customer information</FieldLegend>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField control={form.control} name="firstName" label="First name" required valueType="string" autoComplete="given-name" />
              <InputField control={form.control} name="lastName" label="Last name" required valueType="string" autoComplete="family-name" />
              <InputField control={form.control} name="email" label="Email address" required valueType="string" type="email" autoComplete="email" />
              <InputField control={form.control} name="phone" label="Phone number" required valueType="string" type="tel" autoComplete="tel" />
              <InputField control={form.control} name="company.name" label="Company name" required valueType="string" autoComplete="organization" />
              <InputField control={form.control} name="company.title" label="Job title" valueType="string" autoComplete="organization-title" />
              <InputField control={form.control} name="age" label="Age" required valueType="number" type="number" inputMode="numeric" min={0} max={120} />
              <InputField control={form.control} name="gender" label="Gender" valueType="string" />
              <InputField control={form.control} name="maidenName" label="Maiden name" valueType="string" />
              <InputField control={form.control} name="birthDate" label="Date of birth" valueType="string" type="date" />
              <InputField control={form.control} name="company.department" label="Department" valueType="string" />
              <InputField control={form.control} name="image" label="Profile image URL" valueType="string" type="url" />
            </div>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Address</FieldLegend>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField control={form.control} name="address.address" label="Street address" valueType="string" autoComplete="street-address" />
              <InputField control={form.control} name="address.city" label="City" valueType="string" autoComplete="address-level2" />
              <InputField control={form.control} name="address.state" label="State or region" valueType="string" autoComplete="address-level1" />
              <InputField control={form.control} name="address.stateCode" label="State code" valueType="string" />
              <InputField control={form.control} name="address.postalCode" label="Postal code" valueType="string" autoComplete="postal-code" />
              <InputField control={form.control} name="address.country" label="Country" valueType="string" autoComplete="country-name" />
            </div>
          </FieldSet>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <SubmitButton isDirty={form.formState.isDirty} isSubmitting={isSubmitting}>
              {customer ? "Save changes" : "Add customer"}
            </SubmitButton>
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
}
