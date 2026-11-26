import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

export default function AddCustomerButton() {
  return (
    <Button
      className="min-h-11 w-full sm:w-auto"
      nativeButton={false}
      render={<Link href={routes.newCustomer} />}
    >
      <Plus aria-hidden="true" data-icon="inline-start" />
      Add customer
    </Button>
  );
}
