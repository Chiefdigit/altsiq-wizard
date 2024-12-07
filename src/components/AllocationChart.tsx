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
      useSafeResolution: false  // Disable safe resolution to get sharper rendering
    });
    
    chartRef.current = root;

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart with zero padding
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(70),
        startAngle: 180,
        endAngle: 360,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
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
      stroke: am5.color(0x000000),  // Set stroke to transparent
      strokeWidth: 0,  // Set stroke width to 0
      strokeOpacity: 0,  // Set stroke opacity to 0
      fillOpacity: 1  // Full opacity for crisp edges
    });

    // Hide labels completely
    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    // Add data with updated colors
    const data = [
      {
        category: "Stocks (Equities)",
        value: allocations.equities,
        settings: { fill: am5.color("#2563eb") }
      },
      {
        category: "Bonds (Fixed Income)",
        value: allocations.bonds,
        settings: { fill: am5.color("#000000") }
      },
      {
        category: "Cash (and Equivalents)",
        value: allocations.cash,
        settings: { fill: am5.color("#22c55e") }
      },
      {
        category: "Private Alternatives)",
        value: allocations.alternatives,
        settings: { fill: am5.color("#ef4444") }
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
      style={{ width: "100%", height: "300px", margin: 0, padding: 0 }}
      className="mt-0"
    />
  );
};