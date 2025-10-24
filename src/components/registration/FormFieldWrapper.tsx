// Form Field Wrapper with Error Display
'use client';

import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

interface FormFieldWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormFieldWrapper<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  children,
}: FormFieldWrapperProps<T>) {
  const { errors } = useFormState({ control });
  const error = errors[name];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
