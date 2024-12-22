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
  const [currentStrategy, setCurrentStrategy] = useState<string>("");

  // Initialize and sync strategy
  useEffect(() => {
    const initializeStrategy = () => {
      // First try to get strategy from context
      if (selectedStrategy) {
        console.log('Using strategy from context:', selectedStrategy);
        setCurrentStrategy(selectedStrategy);
        return;
      }

      // Fallback to localStorage
      const savedStrategy = localStorage.getItem('selectedStrategy');
      if (savedStrategy) {
        console.log('Using strategy from localStorage:', savedStrategy);
        setCurrentStrategy(savedStrategy);
        return;
      }

      // Default to diversification if no strategy is found
      console.log('No strategy found, defaulting to diversification');
      setCurrentStrategy('diversification');
    };

    initializeStrategy();
  }, [selectedStrategy]);

  // Load allocations whenever strategy changes
  useEffect(() => {
    if (!currentStrategy) return;

    const loadAllocations = () => {
      if (currentStrategy === 'advanced') {
        const savedAllocations = localStorage.getItem('alternativesAllocations');
        if (savedAllocations) {
          console.log('Loading saved advanced allocations:', JSON.parse(savedAllocations));
          setCustomAllocations(JSON.parse(savedAllocations));
        }
      } else {
        const strategyAllocations = STRATEGY_ALLOCATIONS[currentStrategy as keyof typeof STRATEGY_ALLOCATIONS];
        console.log('Loading strategy allocations for:', currentStrategy, strategyAllocations);
        setCustomAllocations(strategyAllocations);
      }
    };

    loadAllocations();
  }, [currentStrategy]);

  useLayoutEffect(() => {
    if (!customAllocations || Object.keys(customAllocations).length === 0) {
      console.log('No allocations available, skipping chart render');
      return;
    }

    console.log('Rendering chart with allocations:', customAllocations);

    if (chartRef.current) {
      chartRef.current.dispose();
    }

    const root = am5.Root.new("alternatives-chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
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

    return () => {
      root.dispose();
    };
  }, [customAllocations, hiddenCategories]);

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
        visibleCategories={new Set(Object.keys(customAllocations))}
        initialAllocations={customAllocations}
        onSave={handleSaveAllocations}
      />
    </Card>
  );
};