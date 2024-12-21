import React from "react";
import { Button } from "@/components/ui/button";

interface StrategyActionsProps {
  isSelected: boolean;
  onSelect: () => void;
  onContinue: () => void;
}

export const StrategyActions = ({
  isSelected,
  onSelect,
  onContinue,
}: StrategyActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <Button 
        onClick={onSelect}
        className={`rounded-full ${isSelected ? 'bg-primary hover:bg-primary/90' : 'bg-black hover:bg-black/90'} text-white`}
        disabled={isSelected}
      >
        {isSelected ? "Selected" : "Select"}
      </Button>
      <Button 
        onClick={onContinue}
        className="bg-primary hover:bg-primary/90"
        disabled={!isSelected}
      >
        Continue
      </Button>
    </div>
  );
};