import { useLayoutEffect, useRef, useId } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
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
  const chartId = useId();

  useLayoutEffect(() => {
    if (!chartRef.current) {
      const root = am5.Root.new(`chartdiv-${chartId}`, {
        useSafeResolution: false
      });

      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      const chart = root.container.children.push(
        am5radar.RadarChart.new(root, {
          startAngle: 180,
          endAngle: 360,
          innerRadius: am5.percent(80),
          layout: root.verticalLayout
        })
      );

      // Create axis and its renderer
      const axisRenderer = am5radar.AxisRendererCircular.new(root, {
        strokeOpacity: 0.1
      });

      const xAxis = chart.xAxes.push(
        am5radar.ValueAxis.new(root, {
          maxDeviation: 0,
          min: 0,
          max: 100,
          strictMinMax: true,
          renderer: axisRenderer
        })
      );

      // Create series
      const series = chart.series.push(
        am5radar.RadarColumnSeries.new(root, {
          xAxis: xAxis,
          valueXField: "value",
          categoryYField: "category",
          clustered: false
        })
      );

      series.columns.template.setAll({
        width: am5.percent(80),
        tooltipText: "{category}: {valueX}%",
        cornerRadius: 4,
        templateField: "columnSettings"
      });

      const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);
      const unallocated = Math.max(0, 100 - totalAllocation);

      const data = [
        {
          category: "Stocks (Equities)",
          value: allocations.equities,
          columnSettings: { fill: am5.color("#2563eb") }
        },
        {
          category: "Bonds (Fixed Income)",
          value: allocations.bonds,
          columnSettings: { fill: am5.color("#000000") }
        },
        {
          category: "Cash (and Equivalents)",
          value: allocations.cash,
          columnSettings: { fill: am5.color("#22c55e") }
        },
        {
          category: "Private Alternatives",
          value: allocations.alternatives,
          columnSettings: { fill: am5.color("#F97316") }
        }
      ];

      if (unallocated > 0) {
        data.push({
          category: "Unallocated",
          value: unallocated,
          columnSettings: { fill: am5.color("#64748b") }
        });
      }

      series.data.setAll(data);

      chartRef.current = root;

      return () => {
        root.dispose();
      };
    } else {
      const chart = chartRef.current.container.children.getIndex(0) as am5radar.RadarChart;
      if (chart) {
        const series = chart.series.getIndex(0) as am5radar.RadarColumnSeries;
        if (series) {
          const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);
          const unallocated = Math.max(0, 100 - totalAllocation);
          
          const data = [
            {
              category: "Stocks (Equities)",
              value: allocations.equities,
              columnSettings: { fill: am5.color("#2563eb") }
            },
            {
              category: "Bonds (Fixed Income)",
              value: allocations.bonds,
              columnSettings: { fill: am5.color("#000000") }
            },
            {
              category: "Cash (and Equivalents)",
              value: allocations.cash,
              columnSettings: { fill: am5.color("#22c55e") }
            },
            {
              category: "Private Alternatives",
              value: allocations.alternatives,
              columnSettings: { fill: am5.color("#F97316") }
            }
          ];

          if (unallocated > 0) {
            data.push({
              category: "Unallocated",
              value: unallocated,
              columnSettings: { fill: am5.color("#64748b") }
            });
          }

          series.data.setAll(data);
        }
      }
    }
  }, [allocations, chartId]);

  return (
    <div id={`chartdiv-${chartId}`} style={{ width: "100%", height: "300px" }} />
  );
};