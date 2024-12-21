import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface StrategySelectorProps {
  selectedStrategy: string;
  onStrategyChange: (value: string) => void;
}

export const StrategySelector = ({
  selectedStrategy,
  onStrategyChange,
}: StrategySelectorProps) => {
  return (
    <ToggleGroup
      type="single"
      value={selectedStrategy}
      onValueChange={(value) => {
        if (value) {
          onStrategyChange(value);
        }
      }}
      className="flex flex-wrap justify-start gap-2 border rounded-lg p-2"
    >
      <ToggleGroupItem value="diversification" className="flex-1 data-[state=on]:bg-[#8A898C] data-[state=on]:text-white">
        Diversification
      </ToggleGroupItem>
      <ToggleGroupItem value="income" className="flex-1 data-[state=on]:bg-[#8A898C] data-[state=on]:text-white">
        Income
      </ToggleGroupItem>
      <ToggleGroupItem value="growth" className="flex-1 data-[state=on]:bg-[#8A898C] data-[state=on]:text-white">
        Growth
      </ToggleGroupItem>
      <ToggleGroupItem value="preservation" className="flex-1 data-[state=on]:bg-[#8A898C] data-[state=on]:text-white">
        Preservation
      </ToggleGroupItem>
      <ToggleGroupItem value="advanced" className="flex-1 data-[state=on]:bg-[#8A898C] data-[state=on]:text-white">
        + Advanced
      </ToggleGroupItem>
    </ToggleGroup>
  );
};