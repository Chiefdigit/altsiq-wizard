import React, { useRef, useId, useLayoutEffect } from "react";
import { Card } from "@/components/ui/card";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { StrategyProps } from "./types";

interface ChartDataItem {
  category: string;
  value: number;
  fill: am5.Color;
}

export const StrategyCard = ({ strategy }: { strategy: StrategyProps }) => {
  const chartRef = useRef<am5.Root | null>(null);
  const chartId = useId();

  const legendItems = [
    { label: "Stocks", value: strategy.allocations.equities, color: "#9b87f5" },
    { label: "Bonds", value: strategy.allocations.bonds, color: "#7E69AB" },
    { label: "Cash", value: strategy.allocations.cash, color: "#6E59A5" },
    { label: "Alts", value: strategy.allocations.alternatives, color: "#D6BCFA" },
  ];

  useLayoutEffect(() => {
    if (!chartRef.current) {
      const root = am5.Root.new(`chartdiv-${chartId}`);
      chartRef.current = root;

      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
          x: am5.p0,
          centerX: am5.p0
        })
      );

      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
          alignLabels: false
        })
      );

      series.labels.template.set("visible", false);
      series.ticks.template.set("visible", false);

      const data: ChartDataItem[] = [
        {
          category: "Stocks",
          value: strategy.allocations.equities,
          fill: am5.color(legendItems[0].color)
        },
        {
          category: "Bonds",
          value: strategy.allocations.bonds,
          fill: am5.color(legendItems[1].color)
        },
        {
          category: "Cash",
          value: strategy.allocations.cash,
          fill: am5.color(legendItems[2].color)
        },
        {
          category: "Alts",
          value: strategy.allocations.alternatives,
          fill: am5.color(legendItems[3].color)
        }
      ];

      series.data.setAll(data);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [strategy.allocations, chartId, legendItems]);

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{strategy.title}</h3>
        <p className="text-gray-600">{strategy.objective}</p>
        
        <div id={`chartdiv-${chartId}`} style={{ width: "100%", height: "300px" }} />
        
        <div className="flex flex-wrap gap-4 justify-start">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">
                {item.label}: {item.value}%
              </span>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-medium mb-2">Typically, an investor seeking {strategy.title.toLowerCase()} is:</h4>
          <ul className="space-y-2">
            {strategy.characteristics.map((char, index) => (
              <li key={index} className="text-sm text-gray-600">• {char}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Volatility:</h4>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-32 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full" />
            <span className="text-sm font-medium">{strategy.volatility}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};