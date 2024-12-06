import { OnboardingWizard } from "@/components/OnboardingWizard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AltsIQ Accelerator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate how you can potentially increase returns with less risk using
            private market alternatives in your portfolio.
          </p>
        </div>
        <OnboardingWizard />
      </div>
    </div>
  );
};

export default Index;