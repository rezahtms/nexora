"use client";

import { useMemo, useRef } from "react";
import type { FormEvent } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@base-ui/react/dialog";
import toast from "react-hot-toast";
import type { Customer, CustomerInput } from "@/lib/types/customer.types";
import { customerSchema, type CustomerFormValues, type ValidCustomerFormValues } from "@/lib/validations/customer.schema";
import useCreateCustomer from "@/lib/hooks/use-create-customer";
import useUpdateCustomer from "@/lib/hooks/use-update-customer";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

type CustomerFormProps = {
  open: boolean;
  customer?: Customer;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
};

export default function CustomerForm({ open, customer, onOpenChange, onComplete }: CustomerFormProps) {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const busy = useRef(false);
  const defaults = useMemo<CustomerFormValues>(() => ({
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
  }), [customer]);
  const form = useForm<CustomerFormValues, unknown, ValidCustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaults,
    values: defaults,
  });
  const pending = form.formState.isSubmitting || createCustomer.isPending || updateCustomer.isPending;

  async function submit(values: ValidCustomerFormValues) {
    try {
      const input: CustomerInput = values;
      if (customer) {
        await updateCustomer.mutateAsync({ id: customer.id, input });
        toast.success("Customer details updated.");
      } else {
        await createCustomer.mutateAsync(input);
        toast.success("Customer added to this session.");
      }
      onOpenChange(false);
      onComplete();
    } catch (error: unknown) {
      toast.error(errorMessage(error));
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    if (busy.current || pending) {
      event.preventDefault();
      return;
    }
    busy.current = true;
    void form.handleSubmit(submit)(event).finally(() => {
      busy.current = false;
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup className="dialog-popup max-h-[90dvh] max-w-2xl overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold tracking-tight">{customer ? "Edit customer" : "Add customer"}</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">Keep the customer record accurate and up to date.</Dialog.Description>
          <form className="mt-6 space-y-6" onSubmit={handleFormSubmit} noValidate>
            <fieldset disabled={pending} className="space-y-5">
              <legend className="sr-only">Customer information</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {renderField("First name", "firstName", form.register("firstName"), form.formState.errors.firstName?.message)}
                {renderField("Last name", "lastName", form.register("lastName"), form.formState.errors.lastName?.message)}
                {renderField("Email address", "email", form.register("email"), form.formState.errors.email?.message, "email")}
                {renderField("Phone number", "phone", form.register("phone"), form.formState.errors.phone?.message, "tel")}
                {renderField("Company name", "company.name", form.register("company.name"), form.formState.errors.company?.name?.message)}
                {renderField("Job title", "company.title", form.register("company.title"), form.formState.errors.company?.title?.message)}
                {renderField("Age", "age", form.register("age"), form.formState.errors.age?.message, "number")}
                {renderField("Gender", "gender", form.register("gender"), form.formState.errors.gender?.message)}
                {renderField("Maiden name", "maidenName", form.register("maidenName"), form.formState.errors.maidenName?.message)}
                {renderField("Date of birth", "birthDate", form.register("birthDate"), form.formState.errors.birthDate?.message, "date")}
                {renderField("Department", "company.department", form.register("company.department"), form.formState.errors.company?.department?.message)}
                {renderField("Profile image URL", "image", form.register("image"), form.formState.errors.image?.message, "url")}
              </div>
              <div className="border-t border-border pt-5">
                <h3 className="text-sm font-semibold">Address</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {renderField("Street address", "address.address", form.register("address.address"), form.formState.errors.address?.address?.message)}
                  {renderField("City", "address.city", form.register("address.city"), form.formState.errors.address?.city?.message)}
                  {renderField("State or region", "address.state", form.register("address.state"), form.formState.errors.address?.state?.message)}
                  {renderField("State code", "address.stateCode", form.register("address.stateCode"), form.formState.errors.address?.stateCode?.message)}
                  {renderField("Postal code", "address.postalCode", form.register("address.postalCode"), form.formState.errors.address?.postalCode?.message)}
                  {renderField("Country", "address.country", form.register("address.country"), form.formState.errors.address?.country?.message)}
                </div>
              </div>
            </fieldset>
            <div className="flex justify-end gap-3 border-t border-border pt-5">
              <Button type="button" variant="outline" className="min-h-11" disabled={pending} onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="min-h-11" disabled={pending}>{pending ? "Saving…" : customer ? "Save changes" : "Add customer"}</Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function renderField(label: string, name: string, register: UseFormRegisterReturn, error?: string, type = "text") {
  const errorId = `${name.replaceAll(".", "-")}-error`;
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" htmlFor={name}>{label}</label>
      <Input id={name} type={type} className="min-h-11" aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...register} />
      {error ? <p className="text-xs font-medium text-destructive" id={errorId}>{error}</p> : null}
    </div>
  );
}

function formatDateForInput(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : date.toISOString().slice(0, 10);
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") return error.message;
  return "We couldn't save this customer. Please try again.";
}
