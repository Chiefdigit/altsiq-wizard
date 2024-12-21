import React from "react";
import { Check } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface WizardStepProps {
  value: string;
  stepNumber: string;
  title: string;
  isComplete?: boolean;
  children: React.ReactNode;
}

export const WizardStep = ({
  value,
  stepNumber,
  title,
  isComplete,
  children,
}: WizardStepProps) => {
  return (
    <AccordionItem value={value} className="border rounded-lg p-2 sm:p-4">
      <AccordionTrigger className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
            {isComplete ? <Check size={14} /> : stepNumber}
          </div>
          <span>{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 sm:pt-6">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};