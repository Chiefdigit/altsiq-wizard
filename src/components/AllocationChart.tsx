import { useLayoutEffect, useRef, useId } from "react";
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
  const chartId = useId();

  useLayoutEffect(() => {
    if (!chartRef.current) {
      const root = am5.Root.new(`chartdiv-${chartId}`, {
        useSafeResolution: false
      });

      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
          innerRadius: am5.percent(50)
        })
      );

      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
          alignLabels: false
        })
      );

      series.slices.template.setAll({
        strokeWidth: 2,
        stroke: am5.color(0xffffff),
        templateField: "settings"
      });

      series.labels.template.set("visible", false);
      series.ticks.template.set("visible", false);

      const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);
      const unallocated = Math.max(0, 100 - totalAllocation);

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
          category: "Private Alternatives",
          value: allocations.alternatives,
          settings: { fill: am5.color("#F97316") }
        }
      ];

      if (unallocated > 0) {
        data.push({
          category: "Unallocated",
          value: unallocated,
          settings: { fill: am5.color("#64748b") }
        });
      }

      series.data.setAll(data);

      chartRef.current = root;

      return () => {
        root.dispose();
      };
    } else {
      const chart = chartRef.current.container.children.getIndex(0) as am5percent.PieChart;
      if (chart) {
        const series = chart.series.getIndex(0) as am5percent.PieSeries;
        if (series) {
          const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);
          const unallocated = Math.max(0, 100 - totalAllocation);
          
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
              category: "Private Alternatives",
              value: allocations.alternatives,
              settings: { fill: am5.color("#F97316") }
            }
          ];

          if (unallocated > 0) {
            data.push({
              category: "Unallocated",
              value: unallocated,
              settings: { fill: am5.color("#64748b") }
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