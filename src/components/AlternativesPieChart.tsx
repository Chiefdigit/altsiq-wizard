import React, { useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";
import { cn } from "@/lib/utils";

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

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(40),
        radius: am5.percent(90)
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        fillField: "color",
        alignLabels: false
      })
    );

    series.slices.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(0xffffff),
      templateField: "sliceSettings"
    });

    series.labels.template.setAll({
      text: "{category}: {value}%",
      radius: 30,
      inside: false,
      textType: "adjusted",
      fill: am5.color(0x000000),
      fontSize: 13,
      fontWeight: "400"
    });

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
        color: am5.color("#E5E7EB"),
        sliceSettings: { forceHidden: true }
      },
      {
        category: "Private Credit",
        value: 0,
        color: am5.color("#E5E7EB"),
        sliceSettings: { forceHidden: true }
      },
      {
        category: "Commodities",
        value: 0,
        color: am5.color("#E5E7EB"),
        sliceSettings: { forceHidden: true }
      },
      {
        category: "Collectibles",
        value: 0,
        color: am5.color("#E5E7EB"),
        sliceSettings: { forceHidden: true }
      }
    ];

    series.data.setAll(data);

    return () => {
      root.dispose();
    };
  }, [selectedStrategy, visibleCategories]);

  const legendItems = [
    ["Private Equity", "Hedge Funds", "Real Assets", "Cryptocurrencies"],
    ["Private Debt", "Private Credit", "Commodities", "Collectibles"]
  ];

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
              <div key={category} className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => toggleCategory(category)}
                >
                  <div 
                    className={cn(
                      "w-4 h-4 rounded transition-colors",
                      getColorForCategory(category),
                      !visibleCategories.has(category) && "opacity-40"
                    )} 
                  />
                  <span 
                    className={cn(
                      "text-sm transition-colors",
                      visibleCategories.has(category) ? "text-gray-900" : "text-gray-400"
                    )}
                  >
                    {category}
                  </span>
                </div>
                <div 
                  className={cn(
                    "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                    visibleCategories.has(category) ? "bg-blue-500" : "bg-gray-300"
                  )}
                  onClick={() => toggleCategory(category)}
                >
                  <div 
                    className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform",
                      visibleCategories.has(category) ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </div>
              </div>
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