import React, { useRef, useId, useLayoutEffect } from "react";
import { Card } from "@/components/ui/card";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { StrategyProps } from "./types";

export const StrategyCard = ({ strategy }: { strategy: StrategyProps }) => {
  const chartRef = useRef<am5.Root | null>(null);
  const chartId = useId();

  useLayoutEffect(() => {
    if (!chartRef.current) {
      const root = am5.Root.new(`chartdiv-${chartId}`);
      chartRef.current = root;

      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout
        })
      );

      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
          alignLabels: false
        })
      );

      // Remove labels and ticks
      series.labels.template.set("visible", false);
      series.ticks.template.set("visible", false);

      series.data.setAll([
        {
          category: "Equities",
          value: strategy.allocations.equities,
          fill: am5.color("#2563eb")
        },
        {
          category: "Bonds",
          value: strategy.allocations.bonds,
          fill: am5.color("#000000")
        },
        {
          category: "Cash",
          value: strategy.allocations.cash,
          fill: am5.color("#22c55e")
        },
        {
          category: "Alternatives",
          value: strategy.allocations.alternatives,
          fill: am5.color("#F97316")
        }
      ]);

      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          y: am5.p100,
          layout: root.horizontalLayout,
          height: am5.percent(20),
          verticalScrollbar: am5.Scrollbar.new(root, {
            orientation: "vertical"
          })
        })
      );

      legend.data.setAll(series.dataItems);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [strategy.allocations, chartId]);

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{strategy.title}</h3>
        <p className="text-gray-600">{strategy.objective}</p>
        
        <div>
          <h4 className="font-medium mb-2">Typically, an investor seeking {strategy.title.toLowerCase()} is:</h4>
          <ul className="space-y-2">
            {strategy.characteristics.map((char, index) => (
              <li key={index} className="text-sm text-gray-600">• {char}</li>
            ))}
          </ul>
        </div>

        <div id={`chartdiv-${chartId}`} style={{ width: "100%", height: "300px" }} />
        
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