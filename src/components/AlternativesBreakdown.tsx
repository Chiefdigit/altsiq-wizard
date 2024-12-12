import React from "react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface AlternativesBreakdownProps {
  selectedStrategy: string;
}

export const AlternativesBreakdown = ({ selectedStrategy }: AlternativesBreakdownProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className={`p-4 ${isMobile ? 'mt-4' : ''}`}>
      <h3 className="text-lg font-semibold mb-4">Portfolio Allocation & Alternatives Breakdown</h3>
      <div
        style={{ width: "100%", height: "400px", margin: 0, padding: 0 }}
        className="mt-0"
      />
    </Card>
  );
};