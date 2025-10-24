// Print ID Card Modal Component
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Printer, AlertCircle } from 'lucide-react';

interface PrintIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: {
    registration_id: string;
    member_id: string;
    full_name: string;
    registration_type: string;
    group_name: string | null;
    yc26_registration_number?: number;
    yc26_attended_number?: number;
    collected_faithbox: boolean | null;
  };
  onPrint: (faithboxCollected?: boolean) => Promise<void>;
}

export function PrintIdModal({ isOpen, onClose, registration, onPrint }: PrintIdModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [showFaithboxPrompt, setShowFaithboxPrompt] = useState(false);

  if (!isOpen) return null;

  const handlePrintClick = async () => {
    // If faithbox registration and not yet collected, show prompt
    if (registration.registration_type === 'faithbox' && !registration.collected_faithbox) {
      setShowFaithboxPrompt(true);
    } else {
      await handleFinalPrint(false);
    }
  };

  const handleFaithboxCollect = async (collected: boolean) => {
    await handleFinalPrint(collected);
  };

  const handleFinalPrint = async (faithboxCollected: boolean) => {
    setIsPrinting(true);
    try {
      await onPrint(faithboxCollected);
      onClose();
    } catch (error) {
      console.error('Print error:', error);
      alert('Failed to print ID card');
    } finally {
      setIsPrinting(false);
      setShowFaithboxPrompt(false);
    }
  };

  if (showFaithboxPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-start mb-4">
            <AlertCircle className="w-6 h-6 text-primary mr-3 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Collect Faithbox
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Has the participant collected their faithbox?
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => handleFaithboxCollect(true)}
              disabled={isPrinting}
              className="flex-1"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Collected'
              )}
            </Button>
            <Button
              onClick={() => setShowFaithboxPrompt(false)}
              variant="outline"
              disabled={isPrinting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-6">
          Print ID Card
        </h2>

        <div className="space-y-6">
          {/* Registration Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-semibold text-foreground">{registration.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member ID:</span>
              <span className="font-mono text-foreground">{registration.member_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registration ID:</span>
              <span className="font-mono text-foreground">{registration.registration_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="capitalize text-foreground">{registration.registration_type}</span>
            </div>
            {registration.yc26_registration_number && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registration #:</span>
                <span className="font-semibold text-foreground">#{registration.yc26_registration_number}</span>
              </div>
            )}
            {registration.group_name ? (
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-muted-foreground">Already Assigned Group:</span>
                <span className="font-bold text-primary text-lg">{registration.group_name}</span>
              </div>
            ) : (
              <div className="border-t border-border pt-2 mt-2">
                <p className="text-sm text-primary font-semibold">
                  ✨ Group will be auto-assigned when you print the ID card
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on camp attendance sequence
                </p>
              </div>
            )}
          </div>

          {/* ID Card Preview */}
          <div className="border-2 border-dashed border-border rounded-lg p-8">
            <div className="max-w-sm mx-auto bg-primary/5 rounded-lg p-6 text-center space-y-4">
              <div className="text-sm text-muted-foreground">ID Card Preview</div>
              <div className="text-2xl font-bold text-primary">
                {registration.member_id}
              </div>
              <div className="text-lg font-semibold text-foreground">
                {registration.full_name}
              </div>
              {registration.group_name ? (
                <div className="text-xl font-bold text-primary">
                  {registration.group_name}
                </div>
              ) : (
                <div className="text-lg font-bold text-muted-foreground italic">
                  Group: Auto-Assigned
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handlePrintClick}
            disabled={isPrinting}
            className="flex-1"
          >
            {isPrinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Printing...
              </>
            ) : (
              <>
                <Printer className="mr-2 h-4 w-4" />
                {registration.group_name ? 'Re-Print ID Card' : 'Print ID Card & Assign Group'}
              </>
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isPrinting}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
