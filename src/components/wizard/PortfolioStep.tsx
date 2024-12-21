import React from "react";
import { Button } from "@/components/ui/button";
import { PortfolioSlider } from "../PortfolioSlider";
import { useWizardState } from "@/hooks/useWizardState";

interface PortfolioStepProps {
  onContinue: () => void;
}

export const PortfolioStep = ({ onContinue }: PortfolioStepProps) => {
  const { portfolioSize, setPortfolioSize } = useWizardState();

  const handleContinue = () => {
    // Store the portfolio size in localStorage to persist it
    localStorage.setItem('portfolioSize', portfolioSize.toString());
    console.log("Portfolio size on continue:", portfolioSize);
    onContinue();
  };

  return (
    <div className="space-y-6">
      <PortfolioSlider
        value={portfolioSize}
        onChange={(value) => {
          console.log("Setting new portfolio size:", value);
          setPortfolioSize(value);
        }}
      />
      <div className="flex justify-end">
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
};