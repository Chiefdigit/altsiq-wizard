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
    // Initialize chart with high DPI settings
    const root = am5.Root.new("chartdiv", {
      useSafeResolution: false,  // Disable safe resolution to get sharper rendering
      pixelRatio: window.devicePixelRatio || 2  // Use device pixel ratio or fallback to 2x
    });
    
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

    // Create series with high-quality rendering settings
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
      templateField: "settings",
      strokeWidth: 0,  // Remove the border
      forceHidden: false,  // Ensure visibility
      fillOpacity: 1,  // Full opacity for crisp edges
    });

    // Hide labels completely
    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    // Add data with updated colors
    const data = [
      {
        category: "Stocks (Equities)",
        value: allocations.equities,
        settings: { fill: am5.color("#007AFF") }  // iOS Blue
      },
      {
        category: "Bonds (Fixed Income)",
        value: allocations.bonds,
        settings: { fill: am5.color("#5856D6") }  // iOS Purple
      },
      {
        category: "Cash (and Equivalents)",
        value: allocations.cash,
        settings: { fill: am5.color("#FF2D55") }  // iOS Pink
      },
      {
        category: "Private Alternatives)",
        value: allocations.alternatives,
        settings: { fill: am5.color("#34C759") }  // iOS Green
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