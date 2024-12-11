import React from "react";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RiskScoreDisplayProps {
  allocations: {
    equities: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
}

export const RiskScoreDisplay = ({ allocations }: RiskScoreDisplayProps) => {
  const calculateRiskScore = () => {
    const { equities, bonds, cash, alternatives } = allocations;
    return (
      (equities * 4 + bonds * 2 + cash * 1 + alternatives * 4) / 100
    ).toFixed(1);
  };

  const getRiskProfile = (score: number) => {
    if (score <= 1.5) return "VERY LOW";
    if (score <= 2.5) return "LOW";
    if (score <= 3.5) return "MODERATE";
    if (score <= 4.5) return "HIGH";
    return "VERY HIGH";
  };

  const score = Number(calculateRiskScore());
  const profile = getRiskProfile(score);
  const position = ((score - 1) / 4) * 100; // Scale position from 1-5 to 0-100%

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Volatility:</h3>
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
                <li>Alternatives: 4 (High risk)</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            {/* Gradient bar */}
            <div className="h-3 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full shadow-sm" />
            
            {/* Indicator dot */}
            <div
              className="absolute w-4 h-4 bg-white border-2 border-gray-800 rounded-full -mt-3.5 transform -translate-x-1/2 shadow-md"
              style={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
            />
          </div>
          
          {/* Risk level text */}
          <div className="mt-4 text-lg font-bold">
            {profile}
          </div>
        </div>
        
        {/* Score value */}
        <div className="text-2xl font-bold min-w-[60px] text-right">
          {score}
        </div>
      </div>
    </Card>
  );
};