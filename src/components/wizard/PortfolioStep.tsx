import React from "react";
import { Button } from "@/components/ui/button";
import { PortfolioSlider } from "../PortfolioSlider";
import { useWizard } from "./WizardContext";

interface PortfolioStepProps {
  onContinue: () => void;
}

export const PortfolioStep = ({ onContinue }: PortfolioStepProps) => {
  const { portfolioSize, setPortfolioSize } = useWizard();

  const handleContinue = () => {
    // Ensure the current portfolioSize is set before continuing
    setPortfolioSize(portfolioSize);
    console.log("Portfolio size on continue:", portfolioSize);
    onContinue();
  };

  return (
    <div className="space-y-6">
      <PortfolioSlider
        value={portfolioSize}
        onChange={setPortfolioSize}
      />
      <div className="flex justify-end">
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
};