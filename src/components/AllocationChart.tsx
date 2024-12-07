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
        startAngle: 180,
        endAngle: 360,
        layout: root.verticalLayout,
        innerRadius: am5.percent(80),
      })
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
      })
    );

    series.slices.template.setAll({
      cornerRadius: 4,
      templateField: "settings",
    });

    // Add data
    const colors = ["#6366f1", "#a855f7", "#38bdf8", "#2dd4bf"];
    const data = [
      { 
        category: "Stocks (Equities)", 
        value: allocations.equities,
        settings: { fill: am5.color(colors[0]) }
      },
      { 
        category: "Bonds (Fixed Income)", 
        value: allocations.bonds,
        settings: { fill: am5.color(colors[1]) }
      },
      { 
        category: "Cash (and Equivalents)", 
        value: allocations.cash,
        settings: { fill: am5.color(colors[2]) }
      },
      { 
        category: "Private Alternatives", 
        value: allocations.alternatives,
        settings: { fill: am5.color(colors[3]) }
      },
    ];

    series.data.setAll(data);

    // Add labels
    series.events.on("datavalidated", () => {
      series.slices.each((slice) => {
        if (slice.dataItem && slice.dataItem.get("value") > 0) {
          const startAngle = slice.get("startAngle", 0);
          const endAngle = slice.get("endAngle", 0);
          const middleAngle = startAngle + (endAngle - startAngle) / 2;
          const category = slice.dataItem.get("category", "");
          const value = slice.dataItem.get("value", 0);

          const label = chart.container.children.push(
            am5.Label.new(root, {
              text: `${category}\n${value}%`,
              fontSize: "0.8em",
              textAlign: "center",
              radius: am5.percent(95),
              centerX: am5.percent(50),
              centerY: am5.percent(50),
              rotation: middleAngle,
            })
          );
        }
      });
    });

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