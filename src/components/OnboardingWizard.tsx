import React, { useState, useEffect } from "react";
import { PortfolioSlider } from "./PortfolioSlider";
import { AllocationSlider } from "./AllocationSlider";
import { AllocationChart } from "./AllocationChart";
import { RiskScoreDisplay } from "./RiskScoreDisplay";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const DEFAULT_ALLOCATIONS = {
  equities: 60,
  bonds: 40,
  cash: 0,
  alternatives: 0,
};

const STRATEGY_DESCRIPTIONS = {
  diversification: {
    title: "Asset Diversification",
    objective: "Spread risk across uncorrelated assets, balancing exposure to traditional asset classes and alternatives.",
    description: "Typically, an investor seeking diversification is:",
    points: [
      "Focused on reducing overall portfolio risk through exposure to uncorrelated assets.",
      "Expecting moderate volatility, willing to accept some risk but avoids large swings.",
      "Seeking steady, risk-adjusted returns that outpace inflation.",
      "Comfortable with a medium to long-term horizon, with moderate liquidity needs.",
      "Prioritizing risk management and balanced exposure over maximizing returns."
    ]
  },
  income: {
    title: "Income Generation",
    objective: "Maximize income generation through assets that provide regular cash flow.",
    description: "Typically, an investor looking to generate income is:",
    points: [
      "Focused on maximizing regular income through interest, dividends, or rent.",
      "Expecting low to moderate volatility and seeks stability in returns.",
      "Looking for steady income generation with modest capital growth.",
      "Has a medium-term horizon, with a need for liquidity to fund regular expenses.",
      "Income-focused, preferring stable, cash-flow-generating assets over risky investments."
    ]
  },
  growth: {
    title: "Long-term Growth",
    objective: "Maximize capital appreciation, willing to take on more risk for higher potential returns.",
    description: "Typically, an investor seeking long-term growth is:",
    points: [
      "Focused on maximizing capital appreciation by investing in high-growth assets.",
      "Expecting high volatility and comfortable with large fluctuations in portfolio value.",
      "Seeking above-average returns, with an emphasis on long-term wealth creation.",
      "Comfortable with a long-term horizon, often in illiquid assets with delayed payouts.",
      "Primarily growth-oriented, willing to take on significant risk for potential future gains."
    ]
  },
  preservation: {
    title: "Asset Preservation",
    objective: "Preserve capital with low volatility and minimal risk.",
    description: "Typically, an investor aiming to preserve assets is:",
    points: [
      "Focused on preserving capital and minimizing risk, with low volatility expectations.",
      "Expecting very low volatility and values stability and predictability in returns.",
      "Seeking modest returns, mainly to protect against inflation without eroding principal.",
      "Prefers a short to medium-term horizon, with a high demand for liquidity.",
      "Highly conservative, more concerned with avoiding losses than seeking gains."
    ]
  },
  advanced: {
    title: "+ Advanced",
    objective: "Let's build a personalized allocation for you.",
    description: "",
    points: []
  }
};

export const OnboardingWizard = () => {
  const [activeStep, setActiveStep] = useState<string>("portfolio");
  const [portfolioSize, setPortfolioSize] = useState(500000);
  const [allocations, setAllocations] = useState(DEFAULT_ALLOCATIONS);
  const [selectedStrategy, setSelectedStrategy] = useState("diversification");

  useEffect(() => {
    setAllocations(DEFAULT_ALLOCATIONS);
  }, [portfolioSize]);

  const handleComplete = () => {
    toast({
      title: "Portfolio Created!",
      description: "Your portfolio has been successfully configured.",
    });
  };

  const updateAllocation = (type: keyof typeof allocations, value: number) => {
    const total = Object.entries(allocations)
      .filter(([key]) => key !== type)
      .reduce((sum, [_, val]) => sum + val, 0);

    if (total + value <= 100) {
      setAllocations({ ...allocations, [type]: value });
    }
  };

  const totalAllocation = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0
  );

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <Accordion
        type="single"
        value={activeStep}
        onValueChange={setActiveStep}
        className="w-full space-y-4"
      >
        <AccordionItem value="portfolio" className="border rounded-lg p-4">
          <AccordionTrigger className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                {activeStep !== "portfolio" ? <Check size={14} /> : "1"}
              </div>
              <span>Portfolio Size</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <PortfolioSlider value={portfolioSize} onChange={setPortfolioSize} />
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setActiveStep("allocation")}>Continue</Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="allocation" className="border rounded-lg p-4">
          <AccordionTrigger className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                {activeStep === "complete" ? <Check size={14} /> : "2"}
              </div>
              <span>Asset Allocation</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <div className="space-y-6">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                <span className="text-sm text-gray-600">Total Allocation: </span>
                <span className="font-semibold">{totalAllocation}%</span>
              </div>
              {Object.entries(allocations).map(([key, value]) => (
                <AllocationSlider
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  onChange={(value) => updateAllocation(key as keyof typeof allocations, value)}
                  portfolioSize={portfolioSize}
                />
              ))}
              <AllocationChart allocations={allocations} />
              <RiskScoreDisplay allocations={allocations} />
              <div className="flex justify-end">
                <Button onClick={() => setActiveStep("strategy")}>Continue</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="strategy" className="border rounded-lg p-4">
          <AccordionTrigger className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                {activeStep === "complete" ? <Check size={14} /> : "3"}
              </div>
              <span>Alts Investment Strategy</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <div className="space-y-6">
              <ToggleGroup
                type="single"
                value={selectedStrategy}
                onValueChange={(value) => {
                  if (value) setSelectedStrategy(value);
                }}
                className="flex flex-wrap justify-start gap-2 border rounded-lg p-2"
              >
                <ToggleGroupItem value="diversification" className="flex-1">
                  Diversification
                </ToggleGroupItem>
                <ToggleGroupItem value="income" className="flex-1">
                  Income
                </ToggleGroupItem>
                <ToggleGroupItem value="growth" className="flex-1">
                  Growth
                </ToggleGroupItem>
                <ToggleGroupItem value="preservation" className="flex-1">
                  Preservation
                </ToggleGroupItem>
                <ToggleGroupItem value="advanced" className="flex-1">
                  + Advanced
                </ToggleGroupItem>
              </ToggleGroup>

              {selectedStrategy && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold">
                    {STRATEGY_DESCRIPTIONS[selectedStrategy].title}
                  </h3>
                  <p className="text-gray-700 font-medium">
                    Objective: {STRATEGY_DESCRIPTIONS[selectedStrategy].objective}
                  </p>
                  {STRATEGY_DESCRIPTIONS[selectedStrategy].description && (
                    <>
                      <p className="text-gray-700 font-medium mt-4">
                        {STRATEGY_DESCRIPTIONS[selectedStrategy].description}
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        {STRATEGY_DESCRIPTIONS[selectedStrategy].points.map((point, index) => (
                          <li key={index} className="text-gray-600">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleComplete}>Complete</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};