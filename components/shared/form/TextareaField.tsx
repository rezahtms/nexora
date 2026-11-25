"use client";

import { useId, type ComponentProps } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type NativeTextareaProps = Omit<ComponentProps<"textarea">, "name" | "value" | "defaultValue" | "onChange">;

type TextareaFieldProps<T extends FieldValues> = NativeTextareaProps & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
};

export default function TextareaField<T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  id,
  ...props
}: TextareaFieldProps<T>) {
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
            <Textarea
              {...props}
              id={fieldId}
              name={field.name}
              ref={field.ref}
              value={typeof field.value === "string" ? field.value : ""}
              onBlur={field.onBlur}
              onChange={(event) => {
                field.onChange(event.target.value);
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
