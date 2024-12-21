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
    "Real Assets",
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

    // Data matching the image
    const data = [
      {
        category: "Private Equity",
        value: 45.45,
        color: am5.color("#69B1FF")
      },
      {
        category: "Hedge Funds",
        value: 27.27,
        color: am5.color("#818CF8")
      },
      {
        category: "Real Assets",
        value: 22.73,
        color: am5.color("#A78BFA")
      },
      {
        category: "Cryptocurrencies",
        value: 4.55,
        color: am5.color("#E879F9")
      },
      {
        category: "Private Debt",
        value: 0,
        color: am5.color("#E5E7EB")
      },
      {
        category: "Private Credit",
        value: 0,
        color: am5.color("#E5E7EB")
      },
      {
        category: "Commodities",
        value: 0,
        color: am5.color("#E5E7EB")
      },
      {
        category: "Collectibles",
        value: 0,
        color: am5.color("#E5E7EB")
      }
    ].map(item => ({
      ...item,
      value: visibleCategories.has(item.category) ? item.value : 0,
      hidden: !visibleCategories.has(item.category)
    }));

    series.data.setAll(data);

    return () => {
      root.dispose();
    };
  }, [selectedStrategy, visibleCategories]); // Added visibleCategories as dependency

  const getColorForCategory = (category: string) => {
    switch (category) {
      case "Private Equity": return "bg-[#69B1FF]";
      case "Hedge Funds": return "bg-[#818CF8]";
      case "Real Assets": return "bg-[#A78BFA]";
      case "Cryptocurrencies": return "bg-[#E879F9]";
      case "Private Debt": return "bg-purple-400";
      case "Private Credit": return "bg-purple-300";
      case "Commodities": return "bg-pink-400";
      case "Collectibles": return "bg-gray-300";
      default: return "bg-gray-200";
    }
  };

  const legendItems = [
    ["Private Equity", "Hedge Funds", "Real Assets", "Cryptocurrencies"],
    ["Private Debt", "Private Credit", "Commodities", "Collectibles"]
  ];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Distribution Chart</h3>
      <div
        id="alternatives-chartdiv"
        style={{ width: "100%", height: "500px" }}
      />
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        {legendItems.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-4 mb-2">
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
        <div className="flex justify-end mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">ADJUST</span>
          </div>
        </div>
      </div>
    </Card>
  );
};