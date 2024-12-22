import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";
import { LegendItem } from "./charts/LegendItem";
import { configureChart } from "./charts/ChartConfig";
import { STRATEGY_ALLOCATIONS, ALTERNATIVES_COLORS } from "@/constants/alternativesConfig";
import { AlternativesAdjustDialog } from "./AlternativesAdjustDialog";

type AlternativesCategory = keyof typeof STRATEGY_ALLOCATIONS.diversification;

interface ChartDataItem {
  category: string;
  value: number;
  color: am5.Color;
}

export const AlternativesPieChart = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { selectedStrategy } = useWizard();
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [customAllocations, setCustomAllocations] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('alternativesAllocations');
    return saved ? JSON.parse(saved) : {};
  });
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('visibleCategories');
    return saved ? new Set(JSON.parse(saved)) : new Set([
      "Private Credit",
      "Private Debt",
      "Real Estate",
      "Commodities",
      "Hedge Funds"
    ]);
  });

  const getCurrentAllocations = (): Record<string, number> => {
    if (!selectedStrategy) return {};
    
    const baseAllocations = { ...STRATEGY_ALLOCATIONS[selectedStrategy] };
    return Object.fromEntries(
      Object.entries(baseAllocations).map(([category, value]) => [
        category,
        customAllocations[category] ?? value
      ])
    ) as Record<string, number>;
  };

  const toggleCategory = (category: string) => {
    setVisibleCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      localStorage.setItem('visibleCategories', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const handleSaveAllocations = (newAllocations: Record<string, number>) => {
    const filteredAllocations = Object.fromEntries(
      Object.entries(newAllocations).filter(([_, value]) => value > 0)
    );
    setCustomAllocations(filteredAllocations);
    localStorage.setItem('alternativesAllocations', JSON.stringify(filteredAllocations));
    
    // Update visible categories based on non-zero allocations
    const newVisibleCategories = new Set(
      Object.entries(newAllocations)
        .filter(([_, value]) => value > 0)
        .map(([category]) => category)
    );
    setVisibleCategories(newVisibleCategories);
    localStorage.setItem('visibleCategories', JSON.stringify(Array.from(newVisibleCategories)));
  };

  useLayoutEffect(() => {
    if (!selectedStrategy) return;

    const root = am5.Root.new("alternatives-chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    chartRef.current = root;

    const { series } = configureChart(root);

    const calculateProportionalData = (): ChartDataItem[] => {
      const currentAllocations = getCurrentAllocations();
      const visibleData = Array.from(visibleCategories)
        .filter(category => (currentAllocations[category] || 0) > 0)
        .map(category => ({
          category,
          value: currentAllocations[category] || 0,
          color: getColorForCategory(category)
        }));

      // Normalize values to sum to 100%
      const total = visibleData.reduce((sum, item) => sum + (item.value || 0), 0);
      return visibleData.map(item => ({
        ...item,
        value: total > 0 ? Math.round(((item.value || 0) / total) * 100) : 0
      }));
    };

    const normalizedData = calculateProportionalData();
    series.data.setAll(normalizedData);

    return () => {
      root.dispose();
    };
  }, [selectedStrategy, visibleCategories, customAllocations]);

  const getColorForCategory = (category: string): am5.Color => {
    const hexColor = ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS] || "#64748b";
    return am5.color(hexColor);
  };

  const legendItems = [
    ["Private Equity", "Hedge Funds", "Real Estate", "Cryptocurrencies"],
    ["Private Debt", "Private Credit", "Commodities", "Collectibles"]
  ];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Select Asset Classes</h3>
      <div
        id="alternatives-chartdiv"
        style={{ width: "100%", height: "500px" }}
      />
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-sm font-medium text-gray-700">Select Asset Classes</h4>
          <button 
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => setIsAdjustDialogOpen(true)}
          >
            ADJUST
          </button>
        </div>
        {legendItems.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-4 mb-4 last:mb-0">
            {row.map((category) => (
              <LegendItem
                key={category}
                category={category}
                isVisible={visibleCategories.has(category)}
                color={ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS]}
                onToggle={() => toggleCategory(category)}
              />
            ))}
          </div>
        ))}
      </div>
      <AlternativesAdjustDialog
        open={isAdjustDialogOpen}
        onOpenChange={setIsAdjustDialogOpen}
        visibleCategories={visibleCategories}
        initialAllocations={getCurrentAllocations()}
        onSave={handleSaveAllocations}
      />
    </Card>
  );
};