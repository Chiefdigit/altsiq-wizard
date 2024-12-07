import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface AllocationChartProps {
  allocations: {
    equities: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
}

export const AllocationChart = ({ allocations }: AllocationChartProps) => {
  const chartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    // Initialize chart
    const root = am5.Root.new("chartdiv");
    chartRef.current = root;

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(70),
        startAngle: 180,
        endAngle: 360
      })
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        startAngle: 180,
        endAngle: 360,
        radius: am5.percent(100),
        innerRadius: am5.percent(70)
      })
    );

    series.slices.template.setAll({
      cornerRadius: 5,
      templateField: "settings"
    });

    // Hide labels completely
    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    // Add data with updated colors
    const data = [
      {
        category: "Stocks (Equities)",
        value: allocations.equities,
        settings: { fill: am5.color("#4B79A1") }  // Deep blue
      },
      {
        category: "Bonds (Fixed Income)",
        value: allocations.bonds,
        settings: { fill: am5.color("#283E51") }  // Navy blue
      },
      {
        category: "Cash (and Equivalents)",
        value: allocations.cash,
        settings: { fill: am5.color("#5F2C82") }  // Purple
      },
      {
        category: "Private Alternatives",
        value: allocations.alternatives,
        settings: { fill: am5.color("#355C7D") }  // Steel blue
      }
    ];

    series.data.setAll(data);

    // Cleanup
    return () => {
      root.dispose();
    };
  }, [allocations]);

  return (
    <div
      id="chartdiv"
      style={{ width: "100%", height: "300px" }}
      className="mt-4"
    />
  );
};