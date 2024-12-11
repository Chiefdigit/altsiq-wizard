import React from "react";
import { Card } from "@/components/ui/card";

interface VolatilityCardProps {
  score: number;
}

export const VolatilityCard = ({ score }: VolatilityCardProps) => {
  const getVolatilityLabel = (score: number) => {
    if (score <= 1.5) return "VERY LOW";
    if (score <= 2.5) return "LOW";
    if (score <= 3.5) return "MODERATE";
    if (score <= 4.5) return "HIGH";
    return "VERY HIGH";
  };

  const getVolatilityWidth = (score: number) => {
    return `${((score - 1) / 4) * 100}%`; // Scale from 1-5 to 0-100%
  };

  return (
    <Card className="p-3 max-w-sm">
      <div className="space-y-1">
        <span className="text-sm font-medium text-gray-600">
          Volatility:
        </span>
        <div className="relative">
          <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full" />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full transform -translate-x-1/2"
            style={{ 
              left: getVolatilityWidth(score)
            }}
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 font-medium">
            {getVolatilityLabel(score)}
          </span>
          <span className="text-xs text-gray-500">
            {score}/5
          </span>
        </div>
      </div>
    </Card>
  );
};