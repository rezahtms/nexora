import type { Customer, CustomerInput } from "@/lib/types/customer.types";
import type {
  CustomerFormValues,
  ValidCustomerFormValues,
} from "@/lib/validations/customer.schema";

export function formatDateForInput(value?: string): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

export function getCustomerFormDefaultValues(customer?: Customer): CustomerFormValues {
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

export function toCustomerInput(data: ValidCustomerFormValues): CustomerInput {
  return {
    ...data,
    image: data.image || undefined,
  };
}
