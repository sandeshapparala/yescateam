// Dynamic Form Section Component - Renders fields from configuration
"use client";

import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { 
  FormInputField, 
  FormDateField, 
  FormNumberField,
  FormTextareaField,
  FormSelectField,
  FormRadioField 
} from './FormFields';

interface FieldOption {
  value: string;
  label: string;
}

interface FieldConfig {
  name: string;
  type: 'input' | 'number' | 'date' | 'textarea' | 'select' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
}

interface SectionConfig {
  title: string;
  titleTe?: string;
  description?: string;
  descriptionTe?: string;
  fields: FieldConfig[];
}

interface DynamicFormSectionProps {
  section: SectionConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function DynamicFormSection({ section, form }: DynamicFormSectionProps) {
  const renderField = (field: FieldConfig) => {
    const commonProps = {
      form,
      name: field.name,
      label: field.label,
      required: field.required,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'input':
        return <FormInputField key={field.name} {...commonProps} />;
      
      case 'number':
        return <FormNumberField key={field.name} {...commonProps} />;
      
      case 'date':
        return <FormDateField key={field.name} {...commonProps} />;
      
      case 'textarea':
        return <FormTextareaField key={field.name} {...commonProps} />;
      
      case 'select':
        return (
          <FormSelectField
            key={field.name}
            {...commonProps}
            options={field.options || []}
          />
        );
      
      case 'radio':
        return (
          <FormRadioField
            key={field.name}
            {...commonProps}
            options={field.options || []}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 mb-6 shadow-lg border-0">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {section.title}
          </h2>
          {section.description && (
            <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {section.fields.map((field) => (
          <div
            key={field.name}
            className={field.type === 'radio' ? 'col-span-full' : ''}
          >
            {renderField(field)}
          </div>
        ))}
      </div>
    </Card>
  );
}
