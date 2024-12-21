import React, { useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";
import { LegendItem } from "./charts/LegendItem";
import { configureChart } from "./charts/ChartConfig";
import { STRATEGY_ALLOCATIONS } from "@/constants/alternativesConfig";

export const AlternativesPieChart = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { selectedStrategy } = useWizard();
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set([
    "Private Credit",
    "Private Debt",
    "Real Estate",
    "Commodities",
    "Hedge Funds"
  ]));

  const toggleCategory = (category: string) => {
    setVisibleCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
        
        // If the category being added had a 0 value, redistribute proportionally
        if (selectedStrategy && STRATEGY_ALLOCATIONS[selectedStrategy][category] === 0) {
          const baseAllocations = STRATEGY_ALLOCATIONS[selectedStrategy];
          const totalNonZeroValue = Object.entries(baseAllocations)
            .filter(([key, value]) => value > 0 && newSet.has(key))
            .reduce((sum, [_, value]) => sum + value, 0);
          
          // Calculate a proportional value (e.g., 5-10% of total)
          const proportionalValue = Math.round(totalNonZeroValue * 0.1); // 10% of total
          
          // This will trigger a re-render with the new proportional value
          console.log(`Adding ${category} with proportional value: ${proportionalValue}%`);
        }
      }
      return newSet;
    });
  };

  useLayoutEffect(() => {
    if (!selectedStrategy) return;

    const root = am5.Root.new("alternatives-chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    chartRef.current = root;

    const { series } = configureChart(root);

    // Get base allocations for the selected strategy
    const baseAllocations = STRATEGY_ALLOCATIONS[selectedStrategy];

    // Calculate data with proportional values for zero-value selections
    const calculateProportionalData = () => {
      const visibleData = Object.entries(baseAllocations)
        .filter(([category]) => visibleCategories.has(category))
        .map(([category, value]) => {
          // If original value was 0 and category is visible, assign proportional value
          if (value === 0 && visibleCategories.has(category)) {
            const totalNonZeroValue = Object.entries(baseAllocations)
              .filter(([key, val]) => val > 0 && visibleCategories.has(key))
              .reduce((sum, [_, val]) => sum + val, 0);
            
            return {
              category,
              value: Math.round(totalNonZeroValue * 0.1), // 10% of total non-zero value
              color: getColorForCategory(category)
            };
          }
          
          return {
            category,
            value,
            color: getColorForCategory(category)
          };
        });

      // Normalize values to sum to 100%
      const total = visibleData.reduce((sum, item) => sum + item.value, 0);
      return visibleData.map(item => ({
        ...item,
        value: Math.round((item.value / total) * 100)
      }));
    };

    const normalizedData = calculateProportionalData();
    series.data.setAll(normalizedData);

    return () => {
      root.dispose();
    };
  }, [selectedStrategy, visibleCategories]);

  const getColorForCategory = (category: string) => {
    switch (category) {
      case "Private Equity": return am5.color("#69B1FF");
      case "Hedge Funds": return am5.color("#818CF8");
      case "Real Estate": return am5.color("#A78BFA");
      case "Cryptocurrencies": return am5.color("#E879F9");
      case "Private Debt": return am5.color("#D946EF");
      case "Private Credit": return am5.color("#F97316");
      case "Commodities": return am5.color("#0EA5E9");
      case "Collectibles": return am5.color("#8B5CF6");
      default: return am5.color("#64748b");
    }
  };

  const legendItems = [
    ["Private Equity", "Hedge Funds", "Real Estate", "Cryptocurrencies"],
    ["Private Debt", "Private Credit", "Commodities", "Collectibles"]
  ];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Alts Distribution Chart</h3>
      <div
        id="alternatives-chartdiv"
        style={{ width: "100%", height: "500px" }}
      />
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-sm font-medium text-gray-700">Alts Distribution Chart</h4>
          <span className="text-sm font-medium">ADJUST</span>
        </div>
        {legendItems.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-4 mb-4 last:mb-0">
            {row.map((category) => (
              <LegendItem
                key={category}
                category={category}
                isVisible={visibleCategories.has(category)}
                colorClass={`bg-[${getColorForCategory(category).toString()}]`}
                onToggle={() => toggleCategory(category)}
              />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};