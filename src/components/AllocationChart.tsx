import React from "react";
import { Card } from "@/components/ui/card";

interface AllocationChartProps {
  allocations: {
    equities: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
}

export const AllocationChart = ({ allocations }: AllocationChartProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">My Current Portfolio Mix</h3>
      <div
        id="chartdiv"
        style={{ width: "100%", height: "300px", margin: 0, padding: 0 }}
        className="mt-0"
      />
    </Card>
  );
};