import React from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StrategyPieChart } from "../StrategyPieChart";
import { StrategyLegend } from "../StrategyLegend";
import { AdvancedAllocation } from "../AdvancedAllocation";
import { STRATEGY_DESCRIPTIONS } from "@/constants/strategyDescriptions";
import type { AllocationValues } from "@/types/allocation";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StrategyStepProps {
  selectedStrategy: string;
  onStrategyChange: (value: string) => void;
  customAllocations: AllocationValues;
  totalCustomAllocation: number;
  onCustomAllocationChange: (key: keyof AllocationValues, value: string) => void;
  onComplete: () => void;
}

const StrategyVolatilityScore = ({ allocation }: { allocation: AllocationValues }) => {
  const calculateScore = () => {
    const { equities, bonds, cash, alternatives } = allocation;
    return ((equities * 4 + bonds * 2 + cash * 1 + alternatives * 3) / 100).toFixed(2);
  };

  const getRiskProfile = (score: number) => {
    if (score <= 1.5) return "VERY LOW";
    if (score <= 2.5) return "LOW";
    if (score <= 3.5) return "MODERATE";
    if (score <= 4.5) return "HIGH";
    return "VERY HIGH";
  };

  const score = Number(calculateScore());
  const profile = getRiskProfile(score);
  const position = ((score - 1) / 4) * 100; // Scale position from 1-5 to 0-100%

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Volatility</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p>Risk score calculation based on asset allocation weights:</p>
              <ul className="list-disc pl-4 mt-2">
                <li>Equities: 4 (High risk)</li>
                <li>Bonds: 2 (Low risk)</li>
                <li>Cash: 1 (Very low risk)</li>
                <li>Alternatives: 3 (Moderate-high risk)</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{score}</span>
        </div>

        <div className="relative">
          {/* Colored bar background */}
          <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full" />
          
          {/* Indicator dot */}
          <div
            className="absolute w-3 h-3 bg-white border-2 border-primary rounded-full -mt-2.5 transform -translate-x-1/2"
            style={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
          />
          
          {/* Risk level text */}
          <div className="absolute -bottom-6 left-0 text-xs font-semibold text-gray-600">
            {profile}
          </div>
        </div>

        <div className="h-6" /> {/* Spacer for the text below the slider */}
      </div>
    </Card>
  );
};

export const StrategyStep = ({
  selectedStrategy,
  onStrategyChange,
  customAllocations,
  totalCustomAllocation,
  onCustomAllocationChange,
  onComplete,
}: StrategyStepProps) => {
  const getVolatilityLabel = (score: number) => {
    if (score <= 1.5) return "Very Low";
    if (score <= 2.5) return "Low";
    if (score <= 3.5) return "Moderate";
    if (score <= 4.5) return "High";
    return "Very High";
  };

  return (
    <div className="space-y-6">
      <ToggleGroup
        type="single"
        value={selectedStrategy}
        onValueChange={(value) => {
          if (value) onStrategyChange(value);
        }}
        className="flex flex-wrap justify-start gap-2 border rounded-lg p-2"
      >
        <ToggleGroupItem value="diversification" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white">
          Diversification
        </ToggleGroupItem>
        <ToggleGroupItem value="income" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white">
          Income
        </ToggleGroupItem>
        <ToggleGroupItem value="growth" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white">
          Growth
        </ToggleGroupItem>
        <ToggleGroupItem value="preservation" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white">
          Preservation
        </ToggleGroupItem>
        <ToggleGroupItem value="advanced" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white">
          + Advanced
        </ToggleGroupItem>
      </ToggleGroup>

      {selectedStrategy === "advanced" ? (
        <AdvancedAllocation
          customAllocations={customAllocations}
          totalCustomAllocation={totalCustomAllocation}
          onCustomAllocationChange={onCustomAllocationChange}
        />
      ) : (
        selectedStrategy && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">
              {STRATEGY_DESCRIPTIONS[selectedStrategy].title}
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">
                Objective: {STRATEGY_DESCRIPTIONS[selectedStrategy].objective}
              </p>
              
              <Card className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Volatility Score:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                      {STRATEGY_DESCRIPTIONS[selectedStrategy].volatilityScore}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({getVolatilityLabel(STRATEGY_DESCRIPTIONS[selectedStrategy].volatilityScore!)})
                    </span>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:w-1/2">
                  <StrategyPieChart allocation={STRATEGY_DESCRIPTIONS[selectedStrategy].allocation} />
                </div>
                <StrategyLegend allocation={STRATEGY_DESCRIPTIONS[selectedStrategy].allocation} />
              </div>
              <p className="text-gray-700 font-medium">
                {STRATEGY_DESCRIPTIONS[selectedStrategy].description}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                {STRATEGY_DESCRIPTIONS[selectedStrategy].points.map((point, index) => (
                  <li key={index} className="text-gray-600">
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <StrategyVolatilityScore allocation={STRATEGY_DESCRIPTIONS[selectedStrategy].allocation} />
          </div>
        )
      )}

      <div className="flex justify-end">
        <Button onClick={onComplete}>Complete</Button>
      </div>
    </div>
  );
};