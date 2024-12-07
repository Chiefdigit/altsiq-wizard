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
        radius: am5.percent(90),
        innerRadius: am5.percent(80),
      })
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
        startAngle: 180,
        endAngle: 360,
      })
    );

    series.slices.template.setAll({
      cornerRadius: 5,
      templateField: "sliceSettings",
    });

    series.labels.template.set("forceHidden", true);

    // Add custom labels
    const labelData = [
      { category: "Equities", value: allocations.equities, color: "#38bdf8" },
      { category: "Bonds", value: allocations.bonds, color: "#a855f7" },
      { category: "Cash", value: allocations.cash, color: "#2dd4bf" },
      { category: "Alternatives", value: allocations.alternatives, color: "#f472b6" },
    ];

    labelData.forEach((data, index) => {
      const label = am5.Label.new(root, {
        text: `[fontSize: 12px]${data.category}[/]\n[fontSize: 16px]${data.value}%`,
        textAlign: "center",
        x: am5.percent(50),
        y: am5.percent(50),
        centerX: am5.percent(50),
        centerY: am5.percent(index * 20 + 30),
      });

      chart.bulletsContainer.children.push(label);
    });

    // Set data
    series.data.setAll(
      labelData.map((item) => ({
        category: item.category,
        value: item.value,
        sliceSettings: {
          fill: am5.color(item.color),
        },
      }))
    );

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