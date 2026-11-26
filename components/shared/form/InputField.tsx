"use client";

import { useId, type ComponentProps } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { parseFieldValue } from "@/lib/utils/parseFieldValue";

type NativeInputProps = Omit<ComponentProps<"input">, "name" | "value" | "defaultValue" | "type" | "onChange">;

type InputFieldProps<T extends FieldValues> = NativeInputProps & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  valueType: "string" | "number";
  type?: string;
};

export default function InputField<T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  valueType,
  type = "text",
  id,
  ...props
}: InputFieldProps<T>) {
  const generatedId = useId();
  const fieldId = id ?? `${generatedId}-${name.replaceAll(".", "-")}`;
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
            <Input
              {...props}
              id={fieldId}
              name={field.name}
              ref={field.ref}
              type={type}
              value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}
              onBlur={field.onBlur}
              onChange={(event) => {
                field.onChange(parseFieldValue(event.target.value, valueType));
              }}
              aria-invalid={fieldState.invalid || undefined}
              aria-describedby={errorMessage ? errorId : undefined}
              aria-required={required || undefined}
            />
            <FieldError id={errorId} errors={errorMessage ? [{ message: errorMessage }] : undefined} />
          </Field>
        );
      }}
    />
  );
}
