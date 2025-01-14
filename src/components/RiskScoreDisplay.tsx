import React from "react";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
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
      (equities * 4 + bonds * 2 + cash * 1 + alternatives * 3) / 100
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
        <h3 className="text-lg font-semibold">AltsIQ Portfolio Risk Score</h3>
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