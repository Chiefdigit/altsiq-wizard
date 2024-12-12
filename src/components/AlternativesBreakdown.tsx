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

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
        radius: am5.percent(100),
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
        radius: am5.percent(98)
      })
    );

    series.slices.template.setAll({
      templateField: "settings",
      stroke: am5.color(0x000000),
      strokeWidth: 0,
      strokeOpacity: 0,
      fillOpacity: 1,
      tooltipText: "{category}: {value}%"
    });

    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    const breakdownData = ALTERNATIVES_BREAKDOWN[selectedStrategy as keyof typeof ALTERNATIVES_BREAKDOWN] || ALTERNATIVES_BREAKDOWN.diversification;

    const data = Object.entries(breakdownData).map(([category, value], index) => ({
      category,
      value,
      settings: { 
        fill: am5.color(getColorForIndex(index))
      }
    }));

    series.data.setAll(data);

    return () => {
      root.dispose();
    };
  }, [selectedStrategy, chartId]);

  return (
    <Card className={`p-4 ${isMobile ? 'mt-4' : ''}`}>
      <h3 className="text-lg font-semibold mb-4">Alternatives Breakdown</h3>
      <div
        id={`chartdiv-alternatives-${chartId}`}
        style={{ width: "100%", height: "300px", margin: 0, padding: 0 }}
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