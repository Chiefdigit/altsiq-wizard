import React from "react";
import { Button } from "@/components/ui/button";
import { PortfolioSlider } from "../PortfolioSlider";

interface PortfolioStepProps {
  portfolioSize: number;
  onPortfolioSizeChange: (value: number) => void;
  onContinue: () => void;
}

export const PortfolioStep = ({
  portfolioSize,
  onPortfolioSizeChange,
  onContinue,
}: PortfolioStepProps) => {
  return (
    <div className="space-y-6">
      <PortfolioSlider value={portfolioSize} onChange={onPortfolioSizeChange} />
      <div className="flex justify-end">
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
};