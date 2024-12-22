import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALTERNATIVES_COLORS, STRATEGY_ALLOCATIONS } from "@/constants/alternativesConfig";
import { useWizard } from "@/components/wizard/WizardContext";
import { toast } from "@/components/ui/use-toast";

const ALL_ALTERNATIVES = [
  "Private Equity",
  "Hedge Funds",
  "Real Estate",
  "Private Credit",
  "Private Debt",
  "Collectibles",
  "Cryptocurrencies",
  "Commodities"
];

interface AlternativesAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibleCategories: Set<string>;
  initialAllocations: Record<string, number>;
  onSave: (newAllocations: Record<string, number>) => void;
}

export const AlternativesAdjustDialog = ({
  open,
  onOpenChange,
  initialAllocations,
  onSave,
}: AlternativesAdjustDialogProps) => {
  const { selectedStrategy } = useWizard();
  const [allocations, setAllocations] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open) {
      // Get the current strategy's allocations
      const currentStrategy = localStorage.getItem('selectedStrategy') || selectedStrategy;
      let currentAllocations;

      if (currentStrategy === 'advanced') {
        const savedAllocations = localStorage.getItem('alternativesAllocations');
        currentAllocations = savedAllocations ? JSON.parse(savedAllocations) : initialAllocations;
      } else {
        const strategyKey = currentStrategy as keyof typeof STRATEGY_ALLOCATIONS;
        currentAllocations = STRATEGY_ALLOCATIONS[strategyKey];
      }

      console.log('Dialog opened with strategy:', currentStrategy, 'allocations:', currentAllocations);
      setAllocations(currentAllocations || {});
    }
  }, [open, selectedStrategy, initialAllocations]);

  const handleInputChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAllocations(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const calculateTotal = () => {
    return Object.values(allocations).reduce((sum, value) => sum + value, 0);
  };

  const handleApply = () => {
    const total = calculateTotal();
    if (Math.abs(total - 100) >= 0.01) {
      toast({
        title: "Invalid Allocation",
        description: "Total allocation must equal 100%",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Applying new allocations:', allocations);
    onSave(allocations);
    onOpenChange(false);
    
    toast({
      title: "Allocations Updated",
      description: "Your alternative allocations have been updated successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Private Alternatives</DialogTitle>
          <DialogDescription>Create a custom allocation mix</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {ALL_ALTERNATIVES.map((category) => (
            <div key={category} className="flex items-center gap-4">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ 
                  backgroundColor: ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS] 
                }}
              />
              <span className="flex-1 text-sm">{category}</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={allocations[category] || 0}
                  onChange={(e) => handleInputChange(category, e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm font-medium">Total Allocation:</span>
            <span className={`text-sm font-medium ${
              Math.abs(calculateTotal() - 100) < 0.01 ? 'text-green-500' : 'text-red-500'
            }`}>
              {calculateTotal()}%
            </span>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            CANCEL
          </Button>
          <Button onClick={handleApply} disabled={Math.abs(calculateTotal() - 100) >= 0.01}>
            APPLY
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};