import React from "react";
import { Button } from "@/components/ui/button";
import { PortfolioSlider } from "../PortfolioSlider";
import { useWizard } from "./WizardContext";

interface PortfolioStepProps {
  onContinue: () => void;
}

export const PortfolioStep = ({ onContinue }: PortfolioStepProps) => {
  const { portfolioSize, setPortfolioSize } = useWizard();

  return (
    <div className="space-y-6">
      <PortfolioSlider
        value={portfolioSize}
        onChange={setPortfolioSize}
      />
      <div className="flex justify-end">
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
};