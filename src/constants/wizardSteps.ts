export const WIZARD_STEPS = [
  {
    value: "portfolio",
    stepNumber: "1",
    title: "Portfolio Size",
  },
  {
    value: "allocation",
    stepNumber: "2",
    title: "Asset Allocation",
  },
  {
    value: "strategy",
    stepNumber: "3",
    title: "Investment Strategy",
  },
  {
    value: "alternatives",
    stepNumber: "4",
    title: "Alternatives Allocation",
  },
] as const;

export type WizardStepValue = typeof WIZARD_STEPS[number]["value"];