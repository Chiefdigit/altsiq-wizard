import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";

interface StrategyPieChartProps {
  allocation: {
    equities: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
}

export const StrategyPieChart = ({ allocation }: StrategyPieChartProps) => {
  const chartRef = useRef<am5.Root | null>(null);
  const chartId = React.useId();

  useLayoutEffect(() => {
    const root = am5.Root.new(`chartdiv-${chartId}`, {
      useSafeResolution: false
    });
    
    chartRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        radius: am5.percent(85)
      })
    );

    series.slices.template.setAll({
      templateField: "settings",
      stroke: am5.color(0x000000),
      strokeWidth: 0,
      strokeOpacity: 0,
      fillOpacity: 1
    });

    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    const data = [
      {
        category: "Stocks (Equities)",
        value: allocation.equities,
        settings: { fill: am5.color("#2563eb") }
      },
      {
        category: "Bonds (Fixed Income)",
        value: allocation.bonds,
        settings: { fill: am5.color("#000000") }
      },
      {
        category: "Cash (and Equivalents)",
        value: allocation.cash,
        settings: { fill: am5.color("#22c55e") }
      },
      {
        category: "Private Alternatives",
        value: allocation.alternatives,
        settings: { fill: am5.color("#F97316") }
      }
    ];

    series.data.setAll(data);

    return () => {
      root.dispose();
    };
  }, [allocation, chartId]);

  return (
    <Card className="p-2">
      <div
        id={`chartdiv-${chartId}`}
        style={{ width: "100%", height: "150px", margin: 0, padding: 0 }}
        className="mt-0"
      />
    </Card>
  );
};