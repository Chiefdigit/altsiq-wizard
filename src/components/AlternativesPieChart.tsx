import React, { useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";
import { LegendItem } from "./charts/LegendItem";
import { configureChart } from "./charts/ChartConfig";

export const AlternativesPieChart = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { selectedStrategy } = useWizard();
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set([
    "Private Equity",
    "Hedge Funds",
    "Real Estate",
    "Cryptocurrencies",
    "Private Debt",
    "Private Credit",
    "Commodities",
    "Collectibles"
  ]));

  const toggleCategory = (category: string) => {
    setVisibleCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
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

    // Data with all possible categories
    const allData = [
      {
        category: "Private Equity",
        value: 45,
        color: am5.color("#69B1FF")
      },
      {
        category: "Hedge Funds",
        value: 27,
        color: am5.color("#818CF8")
      },
      {
        category: "Real Assets",
        value: 23,
        color: am5.color("#A78BFA")
      },
      {
        category: "Cryptocurrencies",
        value: 5,
        color: am5.color("#E879F9")
      },
      {
        category: "Private Debt",
        value: 10,
        color: am5.color("#D946EF")
      },
      {
        category: "Private Credit",
        value: 8,
        color: am5.color("#F97316")
      },
      {
        category: "Commodities",
        value: 6,
        color: am5.color("#0EA5E9")
      },
      {
        category: "Collectibles",
        value: 4,
        color: am5.color("#8B5CF6")
      }
    ];

    // Filter and normalize data based on visible categories
    const visibleData = allData
      .filter(item => visibleCategories.has(item.category))
      .map(item => ({
        ...item,
        hidden: !visibleCategories.has(item.category)
      }));

    // Normalize values to sum to 100% and round to nearest integer
    if (visibleData.length > 0) {
      const total = visibleData.reduce((sum, item) => sum + item.value, 0);
      visibleData.forEach(item => {
        item.value = Math.round((item.value / total) * 100);
      });
      
      // Adjust rounding errors to ensure total is exactly 100%
      const newTotal = visibleData.reduce((sum, item) => sum + item.value, 0);
      if (newTotal !== 100 && visibleData.length > 0) {
        const diff = 100 - newTotal;
        visibleData[0].value += diff; // Add any rounding difference to the largest category
      }
    }

    series.data.setAll(visibleData);

    return () => {
      root.dispose();
    };
  }, [selectedStrategy, visibleCategories]);

  const getColorForCategory = (category: string) => {
    switch (category) {
      case "Private Equity": return "bg-[#69B1FF]";
      case "Hedge Funds": return "bg-[#818CF8]";
      case "Real Assets": return "bg-[#A78BFA]";
      case "Cryptocurrencies": return "bg-[#E879F9]";
      case "Private Debt": return "bg-[#D946EF]"; // Updated color
      case "Private Credit": return "bg-[#F97316]"; // Updated color
      case "Commodities": return "bg-[#0EA5E9]"; // Updated color
      case "Collectibles": return "bg-[#8B5CF6]"; // Updated color
      default: return "bg-gray-200";
    }
  };

  const legendItems = [
    ["Private Equity", "Hedge Funds", "Real Assets", "Cryptocurrencies"],
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
          <span className="text-sm font-medium">ADJUST</span>
        </div>
        {legendItems.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-4 mb-4 last:mb-0">
            {row.map((category) => (
              <LegendItem
                key={category}
                category={category}
                isVisible={visibleCategories.has(category)}
                colorClass={getColorForCategory(category)}
                onToggle={() => toggleCategory(category)}
              />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};