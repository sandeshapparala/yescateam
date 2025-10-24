// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

// Registration Form Component
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationFormData } from '@/lib/validations/registration';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormFieldWrapper } from '@/components/registration/FormFieldWrapper';
import { RegistrationType, REGISTRATION_CONFIGS } from '@/lib/registration/types';

interface RegistrationFormProps {
  registrationType: RegistrationType;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  isLoading?: boolean;
}

export function RegistrationForm({ 
  registrationType, 
  onSubmit,
  isLoading = false 
}: RegistrationFormProps) {
  const config = REGISTRATION_CONFIGS[registrationType];
  
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      gender: undefined,
      believer: undefined,
      marriage_status: 'single',
    },
  });

  const handleSubmit = async (data: RegistrationFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {config.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {config.titleTelugu}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Registration Fee: ₹{config.fee}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6 text-card-foreground">
            Personal Information - వ్యక్తిగత సమాచారం
          </h2>
          
          <div className="space-y-6">
            {/* Full Name */}
            <FormFieldWrapper
              control={form.control}
              name="full_name"
              label="Full Name - మీ పేరు"
              required
            >
              <input
                type="text"
                className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                {...form.register('full_name')}
              />
            </FormFieldWrapper>

            {/* Phone Number */}
            <FormFieldWrapper
              control={form.control}
              name="phone_number"
              label="Phone Number - ఫోన్ నంబర్"
              required
            >
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md text-muted-foreground">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="flex-1 px-4 py-2 border border-input bg-background rounded-r-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  {...form.register('phone_number')}
                />
              </div>
            </FormFieldWrapper>

            {/* Gender - Radio Buttons */}
            <FormFieldWrapper
              control={form.control}
              name="gender"
              label="Gender - లింగం"
              required
            >
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="M"
                    className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
                    {...form.register('gender')}
                  />
                  <span className="text-foreground">Male - పురుషుడు</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="F"
                    className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
                    {...form.register('gender')}
                  />
                  <span className="text-foreground">Female - స్త్రీ</span>
                </label>
              </div>
            </FormFieldWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <FormFieldWrapper
                control={form.control}
                name="age"
                label="Age - వయస్సు"
                required
              >
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  {...form.register('age', { valueAsNumber: true })}
                />
              </FormFieldWrapper>

              {/* Date of Birth */}
              <FormFieldWrapper
                control={form.control}
                name="dob"
                label="Date of Birth - పుట్టిన తేదీ"
              >
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  {...form.register('dob')}
                />
              </FormFieldWrapper>
            </div>

            {/* Father Name */}
            <FormFieldWrapper
              control={form.control}
              name="fathername"
              label="Father Name - తండ్రి పేరు"
            >
              <input
                type="text"
                className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                {...form.register('fathername')}
              />
            </FormFieldWrapper>
          </div>
        </div>

        {/* Church Information */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6 text-card-foreground">
            Church Information - సంఘ సమాచారం
          </h2>
          
          <div className="space-y-6">
            {/* Believer - Radio Buttons */}
            <FormFieldWrapper
              control={form.control}
              name="believer"
              label="Believer? - విశ్వాసి?"
              required
            >
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="yes"
                    className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
                    {...form.register('believer')}
                  />
                  <span className="text-foreground">Yes - అవును</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="no"
                    className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
                    {...form.register('believer')}
                  />
                  <span className="text-foreground">No - కాదు</span>
                </label>
              </div>
            </FormFieldWrapper>

            {/* Church Name */}
            <FormFieldWrapper
              control={form.control}
              name="church_name"
              label="Church - మీ సంఘము"
              required
            >
              <input
                type="text"
                className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                {...form.register('church_name')}
              />
            </FormFieldWrapper>

            {/* Address */}
            <FormFieldWrapper
              control={form.control}
              name="address"
              label="Address - అడ్రస్"
              required
            >
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                {...form.register('address')}
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Marriage Status - Dropdown */}
              <FormFieldWrapper
                control={form.control}
                name="marriage_status"
                label="Marriage Status - వైవాహిక స్థితి"
              >
                <select
                  className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  {...form.register('marriage_status')}
                >
                  <option value="">Select - ఎంచుకోండి</option>
                  <option value="single">Unmarried - అవివాహితుడు</option>
                  <option value="married">Married - వివాహితుడు</option>
                  <option value="divorced">Divorced - విడాకులు</option>
                  <option value="widowed">Widowed - వితంతువు</option>
                </select>
              </FormFieldWrapper>

              {/* Date of Baptism */}
              <FormFieldWrapper
                control={form.control}
                name="baptism_date"
                label="Date of Baptism - రక్షింపబడిన తేదీ"
              >
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  {...form.register('baptism_date')}
                />
              </FormFieldWrapper>
            </div>

            {/* Camp Participated Since */}
            <FormFieldWrapper
              control={form.control}
              name="camp_participated_since"
              label="Camp Participated Since - క్యాంప్ లో పాల్గొనడం ఎప్పటి నుండి"
            >
              <input
                type="text"
                placeholder="e.g., YC25, YC24"
                className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                {...form.register('camp_participated_since')}
              />
            </FormFieldWrapper>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6 text-card-foreground">
            Additional Information - అదనపు సమాచారం
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education */}
              <FormFieldWrapper
                control={form.control}
                name="education"
                label="Education - మీ చదువు"
              >
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  {...form.register('education')}
                />
              </FormFieldWrapper>

              {/* Occupation */}
              <FormFieldWrapper
                control={form.control}
                name="occupation"
                label="Occupation - వృత్తి"
              >
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  {...form.register('occupation')}
                />
              </FormFieldWrapper>
            </div>

            {/* Future Goals */}
            <FormFieldWrapper
              control={form.control}
              name="future_goals"
              label="Future Goals - భవిష్యత్తు లక్ష్యాలు"
            >
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                {...form.register('future_goals')}
              />
            </FormFieldWrapper>

            {/* Current Skills */}
            <FormFieldWrapper
              control={form.control}
              name="current_skills"
              label="Current Skills - ప్రస్తుత నైపుణ్యాలు"
            >
              <textarea
                rows={2}
                className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                {...form.register('current_skills')}
              />
            </FormFieldWrapper>

            {/* Desired Skills */}
            <FormFieldWrapper
              control={form.control}
                name="desired_skills"
              label="Desired Skills - కావలసిన నైపుణ్యాలు"
            >
              <textarea
                rows={2}
                className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                {...form.register('desired_skills')}
              />
            </FormFieldWrapper>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pb-8">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-12 py-6 text-lg"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Registration - నమోదు చేయండి'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
