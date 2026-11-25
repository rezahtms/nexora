"use client";

import { useId } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: readonly SelectOption[];
  required?: boolean;
  placeholder?: string;
};

export default function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  required = false,
  placeholder = "Select an option",
}: SelectFieldProps<T>) {
  const generatedId = useId();
  const fieldId = `${generatedId}-${name.replaceAll(".", "-")}`;
  const errorId = `${fieldId}-error`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message;
        return (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={fieldId}>
              {label}
              {required ? <span className="text-destructive"> *</span> : null}
            </FieldLabel>
            <Select
              value={typeof field.value === "string" ? field.value : ""}
              onValueChange={(value) => {
                if (typeof value === "string") {
                  field.onChange(value);
                }
              }}
            >
              <SelectTrigger
                id={fieldId}
                aria-invalid={fieldState.invalid || undefined}
                aria-describedby={errorMessage ? errorId : undefined}
                aria-required={required || undefined}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id={errorId} errors={errorMessage ? [{ message: errorMessage }] : undefined} />
          </Field>
        );
      }}
    />
  );
}
