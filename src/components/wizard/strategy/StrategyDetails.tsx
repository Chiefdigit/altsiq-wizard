import React from "react";
import { Card } from "@/components/ui/card";
import { StrategyPieChart } from "@/components/StrategyPieChart";
import { StrategyLegend } from "@/components/StrategyLegend";
import { VolatilityCard } from "@/components/VolatilityCard";
import { STRATEGY_DESCRIPTIONS } from "@/constants/strategyDescriptions";

interface StrategyDetailsProps {
  selectedStrategy: string;
}

export const StrategyDetails = ({ selectedStrategy }: StrategyDetailsProps) => {
  const strategyInfo = STRATEGY_DESCRIPTIONS[selectedStrategy];

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-xl font-semibold">{strategyInfo.title}</h3>
      <div className="space-y-4">
        <p className="text-gray-700 font-medium">
          Objective: {strategyInfo.objective}
        </p>

        <div className="flex flex-col md:flex-row md:items-start gap-4 pb-6 md:pb-0">
          <div className="md:w-1/2">
            <StrategyPieChart allocation={strategyInfo.allocation} />
          </div>
          <StrategyLegend allocation={strategyInfo.allocation} />
        </div>
        
        <p className="text-gray-700 font-medium">
          {strategyInfo.description}
        </p>
        
        <ul className="list-disc pl-6 space-y-2">
          {strategyInfo.points.map((point, index) => (
            <li key={index} className="text-gray-600">
              {point}
            </li>
          ))}
        </ul>

        <VolatilityCard score={strategyInfo.volatilityScore!} />
      </div>
    </div>
  );
};