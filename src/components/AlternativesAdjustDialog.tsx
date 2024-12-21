import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALTERNATIVES_COLORS } from "@/constants/alternativesConfig";

interface AlternativesAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibleCategories: Set<string>;
  onSave: (newAllocations: Record<string, number>) => void;
}

export const AlternativesAdjustDialog = ({
  open,
  onOpenChange,
  visibleCategories,
  onSave,
}: AlternativesAdjustDialogProps) => {
  const [allocations, setAllocations] = useState<Record<string, number>>({});

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
    onSave(allocations);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Private Alternatives</DialogTitle>
          <p className="text-sm text-gray-500">Create a custom allocation mix</p>
        </DialogHeader>
        <div className="space-y-4">
          {Array.from(visibleCategories).map((category) => (
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