import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface AlternativesBreakdownProps {
  selectedStrategy: string;
}

const ALTERNATIVES_BREAKDOWN = {
  diversification: {
    "Private Equity": 10,
    "Hedge Funds": 15,
    "Real Assets": 20,
    "Private Credit": 10,
    "Private Debt": 10,
    "Collectibles": 5,
    "Cryptocurrencies": 5,
    "Commodities": 25,
  },
  income: {
    "Private Equity": 5,
    "Hedge Funds": 10,
    "Real Assets": 25,
    "Private Credit": 20,
    "Private Debt": 15,
    "Collectibles": 5,
    "Cryptocurrencies": 5,
    "Commodities": 15,
  },
  growth: {
    "Private Equity": 25,
    "Hedge Funds": 20,
    "Real Assets": 15,
    "Private Credit": 10,
    "Private Debt": 5,
    "Collectibles": 10,
    "Cryptocurrencies": 10,
    "Commodities": 5,
  },
  preservation: {
    "Private Equity": 5,
    "Hedge Funds": 15,
    "Real Assets": 20,
    "Private Credit": 15,
    "Private Debt": 20,
    "Collectibles": 5,
    "Cryptocurrencies": 5,
    "Commodities": 15,
  },
};

export const AlternativesBreakdown = ({ selectedStrategy }: AlternativesBreakdownProps) => {
  const chartRef = useRef<am5.Root | null>(null);
  const chartId = React.useId();
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    const root = am5.Root.new(`chartdiv-alternatives-${chartId}`, {
      useSafeResolution: false
    });
    
    chartRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.horizontalLayout,
        radius: am5.percent(95),
      })
    );

    // Create main series
    const mainSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        radius: am5.percent(80),
        tooltip: am5.Tooltip.new(root, {
          labelText: "{category}: {value}%"
        })
      })
    );

    // Create second series
    const detailSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        radius: am5.percent(80),
        tooltip: am5.Tooltip.new(root, {
          labelText: "{category}: {value}%"
        })
      })
    );

    // Set up main series data
    const mainData = [
      { category: "Equities", value: 35, fill: am5.color("#2563eb") },
      { category: "Bonds", value: 20, fill: am5.color("#000000") },
      { category: "Cash", value: 5, fill: am5.color("#22c55e") },
      { category: "Alternatives", value: 40, fill: am5.color("#F97316") }
    ];

    // Get alternatives breakdown data
    const breakdownData = ALTERNATIVES_BREAKDOWN[selectedStrategy as keyof typeof ALTERNATIVES_BREAKDOWN] || ALTERNATIVES_BREAKDOWN.diversification;
    const detailData = Object.entries(breakdownData).map(([category, value], index) => ({
      category,
      value,
      fill: am5.color(getColorForIndex(index))
    }));

    // Configure series
    mainSeries.slices.template.setAll({
      templateField: "fill",
      strokeWidth: 2,
      stroke: am5.color(0xffffff)
    });

    detailSeries.slices.template.setAll({
      templateField: "fill",
      strokeWidth: 2,
      stroke: am5.color(0xffffff)
    });

    // Hide labels and ticks
    mainSeries.labels.template.set("visible", false);
    mainSeries.ticks.template.set("visible", false);
    detailSeries.labels.template.set("visible", false);
    detailSeries.ticks.template.set("visible", false);

    // Set data
    mainSeries.data.setAll(mainData);
    detailSeries.data.setAll(detailData);

    // Create connector line
    const connector = am5.Line.new(root, {
      stroke: am5.color(0xb2b2b2),
      strokeDasharray: [2, 2]
    });

    // Update connector position when slices move
    mainSeries.slices.template.events.on("boundschanged", function(e) {
      const slice = e.target;
      const point = am5.utils.getPointOnCircle(
        slice.get("radius") as number,
        (slice.get("startAngle") as number + slice.get("endAngle") as number) / 2,
        { x: 0, y: 0 }
      );
      
      if (slice.dataItem?.get("category") === "Alternatives") {
        const line = connector;
        line.set("points", [
          { x: point.x, y: point.y },
          { x: -point.x, y: point.y }
        ]);
      }
    });

    return () => {
      root.dispose();
    };
  }, [selectedStrategy, chartId]);

  return (
    <Card className={`p-4 ${isMobile ? 'mt-4' : ''}`}>
      <h3 className="text-lg font-semibold mb-4">Portfolio Allocation & Alternatives Breakdown</h3>
      <div
        id={`chartdiv-alternatives-${chartId}`}
        style={{ width: "100%", height: "400px", margin: 0, padding: 0 }}
        className="mt-0"
      />
    </Card>
  );
};

const getColorForIndex = (index: number): string => {
  const colors = [
    "#2563eb", // Primary blue
    "#64748b", // Secondary gray
    "#22c55e", // Success green
    "#F97316", // Orange
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#14b8a6", // Teal
    "#f59e0b", // Amber
  ];
  return colors[index % colors.length];
};