import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";
import { LegendItem } from "./charts/LegendItem";
import { configureChart } from "./charts/ChartConfig";
import { STRATEGY_ALLOCATIONS, ALTERNATIVES_COLORS } from "@/constants/alternativesConfig";
import { AlternativesAdjustDialog } from "./AlternativesAdjustDialog";
import { SlidersHorizontal } from "lucide-react";

interface ChartDataItem {
  category: string;
  value: number;
  color: am5.Color;
}

export const AlternativesPieChart = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { selectedStrategy } = useWizard();
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [customAllocations, setCustomAllocations] = useState<Record<string, number>>({});
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());

  const getCurrentAllocations = (): Record<string, number> => {
    // Get strategy from localStorage with fallback to context
    const currentStrategy = localStorage.getItem('selectedStrategy') || selectedStrategy;
    console.log('Current strategy:', currentStrategy);

    if (!currentStrategy) {
      console.warn('No strategy found');
      return STRATEGY_ALLOCATIONS.diversification; // Default to diversification
    }

    if (currentStrategy === 'advanced') {
      const savedAllocations = localStorage.getItem('alternativesAllocations');
      return savedAllocations ? JSON.parse(savedAllocations) : customAllocations;
    }

    const strategyKey = currentStrategy as keyof typeof STRATEGY_ALLOCATIONS;
    const allocations = STRATEGY_ALLOCATIONS[strategyKey];
    console.log('Loading allocations for strategy:', currentStrategy, allocations);
    return allocations;
  };

  // Initialize or update allocations when strategy changes
  useEffect(() => {
    const currentAllocations = getCurrentAllocations();
    console.log('Strategy changed, updating allocations:', currentAllocations);
    setCustomAllocations(currentAllocations);
  }, [selectedStrategy]);

  useLayoutEffect(() => {
    const currentAllocations = getCurrentAllocations();
    
    const root = am5.Root.new("alternatives-chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    chartRef.current = root;

    const { series } = configureChart(root);

    console.log('Rendering chart with allocations:', currentAllocations);

    const chartData = Object.entries(currentAllocations)
      .filter(([category]) => !hiddenCategories.has(category))
      .map(([category, value]) => ({
        category,
        value,
        color: am5.color(ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS] || "#64748b")
      }));

    console.log('Chart data:', chartData);
    series.data.setAll(chartData);

    return () => {
      root.dispose();
    };
  }, [selectedStrategy, customAllocations, hiddenCategories]);

  const handleSaveAllocations = (newAllocations: Record<string, number>) => {
    console.log('Saving new allocations:', newAllocations);
    setCustomAllocations(newAllocations);
    localStorage.setItem('alternativesAllocations', JSON.stringify(newAllocations));
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

  const legendItems = [
    ["Private Equity", "Hedge Funds", "Real Estate", "Cryptocurrencies"],
    ["Private Debt", "Private Credit", "Commodities", "Collectibles"]
  ];

  // Get current strategy for display
  const currentStrategy = localStorage.getItem('selectedStrategy') || selectedStrategy;

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Alts Distribution Chart</h3>
        {currentStrategy && (
          <span className="text-sm text-gray-600">
            Current Strategy: {currentStrategy.charAt(0).toUpperCase() + currentStrategy.slice(1)}
          </span>
        )}
      </div>
      <div
        id="alternatives-chartdiv"
        style={{ width: "100%", height: "500px" }}
      />
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-sm font-medium text-gray-700">Select Asset Classes</h4>
          <button 
            className="text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-2"
            onClick={() => setIsAdjustDialogOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            ADJUST
          </button>
        </div>
        {legendItems.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-4 mb-4 last:mb-0">
            {row.map((category) => (
              <LegendItem
                key={category}
                category={category}
                isVisible={!hiddenCategories.has(category)}
                color={ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS]}
                onToggle={() => handleToggle(category)}
              />
            ))}
          </div>
        ))}
      </div>
      <AlternativesAdjustDialog
        open={isAdjustDialogOpen}
        onOpenChange={setIsAdjustDialogOpen}
        visibleCategories={new Set(Object.keys(getCurrentAllocations()))}
        initialAllocations={getCurrentAllocations()}
        onSave={handleSaveAllocations}
      />
    </Card>
  );
};