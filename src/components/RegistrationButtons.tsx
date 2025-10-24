// Registration Navigation Component
'use client';

import Link from 'next/link';
import { ClipboardList, Gift } from 'lucide-react';
import { Button } from './ui/button';

export function RegistrationButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-12">
      <Link href="/register?type=normal">
        <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg">
          <ClipboardList className="mr-2 h-5 w-5" />
          Normal Registration
          <span className="ml-2 text-sm opacity-75">₹500</span>
        </Button>
      </Link>

      <Link href="/register?type=faithbox">
        <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <Gift className="mr-2 h-5 w-5" />
          Faithbox Registration
          <span className="ml-2 text-sm opacity-75">₹250</span>
        </Button>
      </Link>
    </div>
  );
}
