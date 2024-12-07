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
      am5percent.GaugeChart.new(root, {
        startAngle: 180,
        endAngle: 360,
        layout: root.verticalLayout,
        innerRadius: am5.percent(80),
      })
    );

    // Create axis and clock hand
    const axisRenderer = am5percent.AxisRendererCircular.new(root, {
      innerRadius: -10,
      strokeOpacity: 0,
    });

    axisRenderer.labels.template.set("forceHidden", true);
    axisRenderer.grid.template.set("forceHidden", true);

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        max: 100,
        strictMinMax: true,
        renderer: axisRenderer,
      })
    );

    // Add series
    const colors = ["#6366f1", "#a855f7", "#38bdf8", "#2dd4bf"];
    let startValue = 0;

    const data = [
      { category: "Stocks (Equities)", value: allocations.equities },
      { category: "Bonds (Fixed Income)", value: allocations.bonds },
      { category: "Cash (and Equivalents)", value: allocations.cash },
      { category: "Private Alternatives", value: allocations.alternatives },
    ];

    data.forEach((item, index) => {
      const series = chart.series.push(
        am5percent.ClockHandSeries.new(root, {
          xAxis: xAxis,
          valueField: "value",
          startField: "start",
          endField: "end",
          categoryField: "category",
        })
      );

      series.sectors.template.setAll({
        cornerRadius: 4,
        fill: am5.color(colors[index]),
        strokeOpacity: 0,
        tooltipText: "{category}: {value}%",
      });

      series.data.setAll([
        {
          category: item.category,
          start: startValue,
          end: startValue + item.value,
          value: item.value,
        },
      ]);

      // Add percentage labels along the arc
      if (item.value > 0) {
        const labelAngle = 180 + (startValue + item.value / 2) * 1.8; // 1.8 = 180/100 to convert percentage to degrees
        const label = chart.radarContainer.children.push(
          am5.Label.new(root, {
            text: item.category + "\n" + item.value + "%",
            fontSize: "0.8em",
            textAlign: "center",
            radius: am5.percent(95),
            centerX: am5.percent(50),
            centerY: am5.percent(50),
            rotation: labelAngle,
          })
        );
      }

      startValue += item.value;
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