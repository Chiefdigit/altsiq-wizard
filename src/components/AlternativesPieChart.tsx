import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";
import { configureChart } from "./charts/ChartConfig";
import { ALTERNATIVES_COLORS } from "@/constants/alternativesConfig";
import { AlternativesAdjustDialog } from "./AlternativesAdjustDialog";
import { ChartLoadingSpinner } from "./charts/ChartLoadingSpinner";
import { AlternativesChartLegend } from "./charts/AlternativesChartLegend";
import { useAlternativesChartData } from "@/hooks/useAlternativesChartData";
import { toast } from "@/components/ui/use-toast";

export const AlternativesPieChart = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { selectedStrategy } = useWizard();
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  const [currentStrategy, setCurrentStrategy] = useState<string>("");

  // Initialize and sync strategy
  useEffect(() => {
    const savedStrategy = localStorage.getItem('selectedStrategy');
    if (savedStrategy) {
      console.log('Using saved strategy:', savedStrategy);
      setCurrentStrategy(savedStrategy);
    } else if (selectedStrategy) {
      console.log('Using strategy from context:', selectedStrategy);
      setCurrentStrategy(selectedStrategy);
    } else {
      console.log('No strategy found, defaulting to diversification');
      setCurrentStrategy('diversification');
    }
  }, [selectedStrategy]);

  const { customAllocations, isLoading, error } = useAlternativesChartData(currentStrategy);

  useLayoutEffect(() => {
    if (isLoading) {
      console.log('Loading chart data...');
      return;
    }

    if (!customAllocations || Object.keys(customAllocations).length === 0) {
      console.log('No allocations available');
      return;
    }

    console.log('Rendering chart with allocations:', customAllocations);

    if (chartRef.current) {
      chartRef.current.dispose();
    }

    const root = am5.Root.new("alternatives-chartdiv");
    root.setThemes([am5.Theme.new(root)]);
    chartRef.current = root;

    const { series } = configureChart(root);

    const chartData = Object.entries(customAllocations)
      .filter(([category]) => !hiddenCategories.has(category))
      .map(([category, value]) => ({
        category,
        value,
        color: am5.color(ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS] || "#64748b")
      }));

    series.data.setAll(chartData);

    // Notify user when chart is ready
    toast({
      title: "Chart Updated",
      description: `Showing allocations for ${currentStrategy} strategy`,
    });

    return () => {
      root.dispose();
    };
  }, [customAllocations, hiddenCategories, isLoading, currentStrategy]);

  const handleSaveAllocations = (newAllocations: Record<string, number>) => {
    console.log('Saving new allocations:', newAllocations);
    localStorage.setItem('alternativesAllocations', JSON.stringify(newAllocations));
    toast({
      title: "Allocations Saved",
      description: "Your alternative allocations have been updated",
    });
  };

  const handleToggle = (category: string) => {
    setHiddenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-red-500">Error loading chart: {error}</div>
      </Card>
    );
  }

  if (isLoading) {
    return <ChartLoadingSpinner />;
  }

  const displayStrategy = currentStrategy.charAt(0).toUpperCase() + currentStrategy.slice(1);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Alts Distribution Chart</h3>
        <span className="text-sm text-gray-600">
          Current Strategy: {displayStrategy}
        </span>
      </div>
      <div
        id="alternatives-chartdiv"
        style={{ width: "100%", height: "500px" }}
      />
      <AlternativesChartLegend
        onAdjustClick={() => setIsAdjustDialogOpen(true)}
        hiddenCategories={hiddenCategories}
        onToggle={handleToggle}
      />
      <AlternativesAdjustDialog
        open={isAdjustDialogOpen}
        onOpenChange={setIsAdjustDialogOpen}
        visibleCategories={new Set(Object.keys(customAllocations))}
        initialAllocations={customAllocations}
        onSave={handleSaveAllocations}
      />
    </Card>
  );
};