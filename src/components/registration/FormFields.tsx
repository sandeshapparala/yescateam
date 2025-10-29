// Reusable Form Field Components with ShadCN Field
"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RequiredBadge } from "./RequiredBadge";

interface BaseFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  labelTe?: string; // Telugu label
  required?: boolean;
  placeholder?: string;
  description?: string;
}

// Text Input Field
export function FormInputField({
  form,
  name,
  label,
  labelTe,
  required = false,
  placeholder,
  description,
}: BaseFieldProps) {
  const error = form.formState.errors[name];
  const isInvalid = !!error;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={name}>
        {label}
        {labelTe && <span className="text-muted-foreground ml-2">({labelTe})</span>}
        {required && <RequiredBadge />}
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      <Input
        id={name}
        placeholder={placeholder || label}
        {...form.register(name)}
        className="rounded-full"
        aria-invalid={isInvalid}
      />
      <FieldError errors={error ? [error] : []} />
    </Field>
  );
}

// Date Field
export function FormDateField({
  form,
  name,
  label,
  required = false,
}: Omit<BaseFieldProps, 'placeholder' | 'description' | 'labelTe'>) {
  const error = form.formState.errors[name];
  const isInvalid = !!error;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && <RequiredBadge />}
      </FieldLabel>
      <Input
        id={name}
        type="date"
        {...form.register(name)}
        className="rounded-full"
        aria-invalid={isInvalid}
      />
      <FieldError errors={error ? [error] : []} />
    </Field>
  );
}

// Number Field
export function FormNumberField({
  form,
  name,
  label,
  required = false,
  placeholder,
}: Omit<BaseFieldProps, 'labelTe' | 'description'>) {
  const error = form.formState.errors[name];
  const isInvalid = !!error;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && <RequiredBadge />}
      </FieldLabel>
      <Input
        id={name}
        type="number"
        placeholder={placeholder || label}
        {...form.register(name, { valueAsNumber: true })}
        className="rounded-full"
        aria-invalid={isInvalid}
      />
      <FieldError errors={error ? [error] : []} />
    </Field>
  );
}

// Textarea Field
export function FormTextareaField({
  form,
  name,
  label,
  required = false,
  placeholder,
}: Omit<BaseFieldProps, 'labelTe' | 'description'>) {
  const error = form.formState.errors[name];
  const isInvalid = !!error;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && <RequiredBadge />}
      </FieldLabel>
      <Textarea
        id={name}
        placeholder={placeholder || label}
        {...form.register(name)}
        className="min-h-[100px] resize-none"
        aria-invalid={isInvalid}
      />
      <FieldError errors={error ? [error] : []} />
    </Field>
  );
}

// Select Dropdown Field
interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps extends Omit<BaseFieldProps, 'placeholder' | 'description' | 'labelTe'> {
  options: SelectOption[];
}

export function FormSelectField({
  form,
  name,
  label,
  required = false,
  options,
}: FormSelectFieldProps) {
  const error = form.formState.errors[name];
  const isInvalid = !!error;
  const value = form.watch(name);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && <RequiredBadge />}
      </FieldLabel>
      <Select
        value={value}
        onValueChange={(val) => form.setValue(name, val)}
      >
        <SelectTrigger id={name} className="rounded-full" aria-invalid={isInvalid}>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={error ? [error] : []} />
    </Field>
  );
}

// Radio Group Field
interface FormRadioFieldProps extends Omit<BaseFieldProps, 'placeholder' | 'description' | 'labelTe'> {
  options: SelectOption[];
}

export function FormRadioField({
  form,
  name,
  label,
  required = false,
  options,
}: FormRadioFieldProps) {
  const error = form.formState.errors[name];
  const isInvalid = !!error;
  const value = form.watch(name);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel>
        {label}
        {required && <RequiredBadge />}
      </FieldLabel>
      <RadioGroup
        value={value}
        onValueChange={(val) => form.setValue(name, val)}
        className="flex space-x-4"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
            <Label htmlFor={`${name}-${option.value}`} className="font-normal cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <FieldError errors={error ? [error] : []} />
    </Field>
  );
}
