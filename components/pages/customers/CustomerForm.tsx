"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/shared/form/InputField";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { routes } from "@/lib/constants/routes";
import useCreateCustomer from "@/lib/services/customer/customerCreate.controller";
import useUpdateCustomer from "@/lib/services/customer/customerUpdate.controller";
import type { Customer, CustomerInput } from "@/lib/types/customer.types";
import { getCustomerFormDefaultValues, toCustomerInput } from "@/lib/utils/customerForm";
import {
  customerSchema,
  type CustomerFormValues,
  type ValidCustomerFormValues,
} from "@/lib/validations/customer.schema";

type CustomerFormProps = {
  customer?: Customer;
};

export default function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const isEditMode = Boolean(customer);

  const form = useForm<CustomerFormValues, unknown, ValidCustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: getCustomerFormDefaultValues(customer),
  });

  const isSubmitting =
    form.formState.isSubmitting || createCustomer.isPending || updateCustomer.isPending;

  const handleCancel = useCallback(() => {
    if (customer) {
      router.push(routes.customer(customer.id));
      return;
    }
    router.push(routes.customers);
  }, [customer, router]);

  const onSubmit: SubmitHandler<ValidCustomerFormValues> = useCallback(
    async (data) => {
      const input: CustomerInput = toCustomerInput(data);

      if (customer) {
        await updateCustomer.mutateAsync({ id: customer.id, input });
        router.push(routes.customer(customer.id));
        return;
      }

      await createCustomer.mutateAsync(input);
      router.push(routes.customers);
    },
    [createCustomer, customer, router, updateCustomer],
  );

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle>{isEditMode ? "Customer details" : "New customer details"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the customer information and save your changes."
            : "Enter the customer information to add them to your workspace."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="sr-only">Customer information</FieldLegend>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  control={form.control}
                  name="firstName"
                  label="First name"
                  required
                  valueType="string"
                  autoComplete="given-name"
                />
                <InputField
                  control={form.control}
                  name="lastName"
                  label="Last name"
                  required
                  valueType="string"
                  autoComplete="family-name"
                />
                <InputField
                  control={form.control}
                  name="email"
                  label="Email address"
                  required
                  valueType="string"
                  type="email"
                  autoComplete="email"
                />
                <InputField
                  control={form.control}
                  name="phone"
                  label="Phone number"
                  required
                  valueType="string"
                  type="tel"
                  autoComplete="tel"
                />
                <InputField
                  control={form.control}
                  name="company.name"
                  label="Company name"
                  required
                  valueType="string"
                  autoComplete="organization"
                />
                <InputField
                  control={form.control}
                  name="company.title"
                  label="Job title"
                  valueType="string"
                  autoComplete="organization-title"
                />
                <InputField
                  control={form.control}
                  name="age"
                  label="Age"
                  required
                  valueType="number"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={120}
                />
                <InputField
                  control={form.control}
                  name="gender"
                  label="Gender"
                  valueType="string"
                />
                <InputField
                  control={form.control}
                  name="maidenName"
                  label="Maiden name"
                  valueType="string"
                />
                <InputField
                  control={form.control}
                  name="birthDate"
                  label="Date of birth"
                  valueType="string"
                  type="date"
                />
                <InputField
                  control={form.control}
                  name="company.department"
                  label="Department"
                  valueType="string"
                />
                <InputField
                  control={form.control}
                  name="image"
                  label="Profile image URL"
                  valueType="string"
                  type="url"
                />
              </div>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Address</FieldLegend>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  control={form.control}
                  name="address.address"
                  label="Street address"
                  valueType="string"
                  autoComplete="street-address"
                />
                <InputField
                  control={form.control}
                  name="address.city"
                  label="City"
                  valueType="string"
                  autoComplete="address-level2"
                />
                <InputField
                  control={form.control}
                  name="address.state"
                  label="State or region"
                  valueType="string"
                  autoComplete="address-level1"
                />
                <InputField
                  control={form.control}
                  name="address.stateCode"
                  label="State code"
                  valueType="string"
                />
                <InputField
                  control={form.control}
                  name="address.postalCode"
                  label="Postal code"
                  valueType="string"
                  autoComplete="postal-code"
                />
                <InputField
                  control={form.control}
                  name="address.country"
                  label="Country"
                  valueType="string"
                  autoComplete="country-name"
                />
              </div>
            </FieldSet>

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <SubmitButton isDirty={form.formState.isDirty} isSubmitting={isSubmitting}>
                {isEditMode ? "Save changes" : "Add customer"}
              </SubmitButton>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
