import React, { useEffect, useState } from "react";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { WizardProvider } from "@/components/wizard/WizardContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Index: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to fetch a single row from the default_settings table
        const { data, error } = await supabase
          .from('default_settings')
          .select('*')
          .limit(1);

        if (error) {
          console.error('Supabase connection error:', error);
          toast({
            title: "Connection Error",
            description: "Could not connect to Supabase",
            variant: "destructive",
          });
          setIsConnected(false);
        } else {
          console.log('Supabase connection successful:', data);
          toast({
            title: "Connection Successful",
            description: "Successfully connected to Supabase",
          });
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setIsConnected(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {isConnected === false && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Connection Error!</strong>
          <span className="block sm:inline"> Unable to connect to Supabase.</span>
        </div>
      )}
      <WizardProvider>
        <OnboardingWizard />
      </WizardProvider>
    </div>
  );
};

export default Index;