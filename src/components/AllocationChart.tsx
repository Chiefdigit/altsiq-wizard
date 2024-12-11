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
      const root = am5.Root.new(`chartdiv-${chartId}`);
      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      const chart = root.container.children.push(
        am5radar.RadarChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "none",
          wheelY: "none",
          startAngle: -90,
          endAngle: 180
        })
      );

      // Create axis and its renderer
      const axisRenderer = am5radar.AxisRendererCircular.new(root, {
        innerRadius: -10
      });

      axisRenderer.labels.template.setAll({
        radius: 30
      });

      const xAxis = chart.xAxes.push(
        am5radar.AxisRendererCircular.new(root, {
          maxDeviation: 0,
          strokeOpacity: 0.1,
          categoryField: "category"
        })
      );

      const yAxis = chart.yAxes.push(
        am5radar.ValueAxis.new(root, {
          renderer: am5radar.AxisRendererRadial.new(root, {})
        })
      );

      // Create series
      const series = chart.series.push(
        am5radar.RadarColumnSeries.new(root, {
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          categoryXField: "category"
        })
      );

      series.columns.template.setAll({
        width: am5.p50,
        tooltipText: "{category}: {valueY}%",
        cornerRadius: 5,
        templateField: "columnSettings"
      });

      const data = [
        {
          category: "Equities",
          value: allocations.equities,
          columnSettings: { fill: am5.color("#2563eb") }
        },
        {
          category: "Bonds",
          value: allocations.bonds,
          columnSettings: { fill: am5.color("#000000") }
        },
        {
          category: "Cash",
          value: allocations.cash,
          columnSettings: { fill: am5.color("#22c55e") }
        },
        {
          category: "Alternatives",
          value: allocations.alternatives,
          columnSettings: { fill: am5.color("#F97316") }
        }
      ];

      xAxis.data.setAll(data);
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
          const data = [
            {
              category: "Equities",
              value: allocations.equities,
              columnSettings: { fill: am5.color("#2563eb") }
            },
            {
              category: "Bonds",
              value: allocations.bonds,
              columnSettings: { fill: am5.color("#000000") }
            },
            {
              category: "Cash",
              value: allocations.cash,
              columnSettings: { fill: am5.color("#22c55e") }
            },
            {
              category: "Alternatives",
              value: allocations.alternatives,
              columnSettings: { fill: am5.color("#F97316") }
            }
          ];

          const xAxis = chart.xAxes.getIndex(0);
          if (xAxis) {
            xAxis.data.setAll(data);
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