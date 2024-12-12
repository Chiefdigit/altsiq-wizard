import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import type { AllocationValues } from "@/types/allocation";

interface PieOfPieChartProps {
  mainAllocation: AllocationValues;
  alternativesBreakdown?: {
    privateEquity: number;
    realEstate: number;
    hedge: number;
    venture: number;
  };
}

export const PieOfPieChart = ({ mainAllocation, alternativesBreakdown = {
  privateEquity: 25,
  realEstate: 25,
  hedge: 25,
  venture: 25
} }: PieOfPieChartProps) => {
  const chartRef = useRef<am5.Root | null>(null);
  const chartId = React.useId();

  useLayoutEffect(() => {
    // Create root element
    const root = am5.Root.new(`chartdiv-${chartId}`, {
      useSafeResolution: false
    });
    
    chartRef.current = root;
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.horizontalLayout,
        radius: am5.percent(95)
      })
    );

    // Create main series
    const mainSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "MainSeries",
        valueField: "value",
        categoryField: "category",
        radius: am5.percent(70),
        tooltip: am5.Tooltip.new(root, {
          labelText: "{category}: {value}%"
        })
      })
    );

    // Create linked series for alternatives breakdown
    const linkedSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "AlternativesSeries",
        valueField: "value",
        categoryField: "category",
        radius: am5.percent(70),
        tooltip: am5.Tooltip.new(root, {
          labelText: "{category}: {value}%"
        })
      })
    );

    // Set up main series data
    const mainData = [
      {
        category: "Stocks (Equities)",
        value: mainAllocation.equities,
        settings: { fill: am5.color("#2563eb") }
      },
      {
        category: "Bonds (Fixed Income)",
        value: mainAllocation.bonds,
        settings: { fill: am5.color("#000000") }
      },
      {
        category: "Cash (and Equivalents)",
        value: mainAllocation.cash,
        settings: { fill: am5.color("#22c55e") }
      },
      {
        category: "Private Alternatives",
        value: mainAllocation.alternatives,
        settings: { fill: am5.color("#F97316") }
      }
    ];

    // Set up alternatives breakdown data
    const alternativesData = [
      {
        category: "Private Equity",
        value: alternativesBreakdown.privateEquity,
        settings: { fill: am5.color("#FB923C") }
      },
      {
        category: "Real Estate",
        value: alternativesBreakdown.realEstate,
        settings: { fill: am5.color("#FDBA74") }
      },
      {
        category: "Hedge Funds",
        value: alternativesBreakdown.hedge,
        settings: { fill: am5.color("#FED7AA") }
      },
      {
        category: "Venture Capital",
        value: alternativesBreakdown.venture,
        settings: { fill: am5.color("#FFEDD5") }
      }
    ];

    // Configure series
    mainSeries.slices.template.setAll({
      templateField: "settings",
      strokeWidth: 2,
      stroke: am5.color(0xffffff)
    });

    linkedSeries.slices.template.setAll({
      templateField: "settings",
      strokeWidth: 2,
      stroke: am5.color(0xffffff)
    });

    // Hide labels and ticks
    mainSeries.labels.template.set("visible", false);
    mainSeries.ticks.template.set("visible", false);
    linkedSeries.labels.template.set("visible", false);
    linkedSeries.ticks.template.set("visible", false);

    // Set data
    mainSeries.data.setAll(mainData);
    linkedSeries.data.setAll(alternativesData);

    // Create link between main "alternatives" slice and breakdown chart
    mainSeries.events.on("datavalidated", () => {
      const alternativesSlice = mainSeries.slices.getIndex(3); // Index of alternatives slice
      if (alternativesSlice) {
        const percentage = alternativesSlice.dataItem.get("valuePercentTotal");
        const endAngle = alternativesSlice.get("startAngle") + alternativesSlice.get("arc") * percentage;
        const startAngle = alternativesSlice.get("startAngle");

        linkedSeries.set("startAngle", startAngle);
        linkedSeries.set("endAngle", endAngle);
      }
    });

    // Animate chart
    mainSeries.appear(1000, 100);
    linkedSeries.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [mainAllocation, alternativesBreakdown, chartId]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Portfolio Allocation & Alternatives Breakdown</h3>
      <div
        id={`chartdiv-${chartId}`}
        style={{ width: "100%", height: "400px" }}
      />
    </Card>
  );
};