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

    // Hide default labels
    series.labels.template.set("visible", false);

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
      }
    ];

    series.data.setAll(data);

    // Add custom labels
    series.events.on("datavalidated", function() {
      series.slices.each((slice) => {
        const dataItem = slice.dataItem;
        if (dataItem) {
          const value = dataItem.get("valueWorking");
          const category = dataItem.get("categoryY");
          
          if (typeof value === "number" && value > 0) {
            const startAngle = slice.get("startAngle");
            const arc = slice.get("arc");
            const middleAngle = startAngle + arc / 2;

            chart.container.children.push(
              am5.Label.new(root, {
                text: `${category}\n${value}%`,
                fontSize: "0.8em",
                textAlign: "center",
                radius: am5.percent(95),
                centerX: am5.percent(50),
                centerY: am5.percent(50),
                rotation: middleAngle
              })
            );
          }
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