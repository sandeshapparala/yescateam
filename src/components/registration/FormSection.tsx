// Form Section Component with Animation
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps {
  title: string;
  titleTe?: string;
  description: string;
  descriptionTe?: string;
  children: React.ReactNode;
  delay?: number;
}

export function FormSection({
  title,
  titleTe,
  description,
  descriptionTe,
  children,
  delay = 0,
}: FormSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold">
            {title}
            {titleTe && <span className="text-muted-foreground ml-3 text-lg font-normal">({titleTe})</span>}
          </CardTitle>
          <CardDescription className="text-base">
            {description}
            {descriptionTe && (
              <span className="block mt-1 text-sm">{descriptionTe}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface FormGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
}

export function FormGrid({ children, cols = 2 }: FormGridProps) {
  const gridClass = cols === 1 
    ? "grid gap-6"
    : cols === 2
    ? "grid gap-6 md:grid-cols-2"
    : "grid gap-6 md:grid-cols-2 lg:grid-cols-3";
    
  return <div className={gridClass}>{children}</div>;
}
