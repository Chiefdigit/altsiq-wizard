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
      (equities * 5 + bonds * 2 + cash * 1 + alternatives * 4) / 100
    ).toFixed(1);
  };

  const getRiskProfile = (score: number) => {
    if (score <= 2.0) return "Cautious";
    if (score <= 3.0) return "Conservative";
    if (score <= 4.0) return "Moderate";
    if (score <= 4.5) return "Aggressive";
    return "Speculative";
  };

  const score = Number(calculateRiskScore());
  const profile = getRiskProfile(score);
  const position = ((score - 1) / 4) * 100; // Scale position from 1-5 to 0-100%

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AltsIQ Portfolio Risk Score</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p>Risk score calculation based on asset allocation weights:</p>
              <ul className="list-disc pl-4 mt-2">
                <li>Equities: 5 (High risk)</li>
                <li>Bonds: 2 (Low risk)</li>
                <li>Cash: 1 (Very low risk)</li>
                <li>Alternatives: 4 (Moderate-high risk)</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-lg text-gray-600 uppercase">{profile}</span>
        </div>

        <div className="relative h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full">
          <div
            className="absolute w-3 h-3 bg-white border-2 border-primary rounded-full -mt-0.5 transform -translate-x-1/2"
            style={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>1.0</span>
          <span>2.0</span>
          <span>3.0</span>
          <span>4.0</span>
          <span>5.0</span>
        </div>
      </div>
    </Card>
  );
};