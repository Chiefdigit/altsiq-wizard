import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";

interface AllocationChartProps {
  allocations: {
    equities: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
}

interface ChartDataItem {
  category: string;
  equities: number;
  bonds: number;
  cash: number;
  alternatives: number;
  unallocated?: number;
  columnSettings: {
    fill: am5.Color;
  };
}

export const AllocationChart = ({ allocations }: AllocationChartProps) => {
  const chartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv", {
      useSafeResolution: false
    });
    
    chartRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
      })
    );

    // Create axes
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryXField: "category",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30
        })
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        numberFormat: "#'%'",
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    // Create series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Allocation",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "category",
        stacked: true
      })
    );

    series.columns.template.setAll({
      tooltipText: "{category}: {valueY}%",
      templateField: "columnSettings",
      width: am5.percent(50)
    });

    // Calculate total allocation
    const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);
    
    // Calculate unallocated amount
    const unallocated = Math.max(0, 100 - totalAllocation);

    const data: ChartDataItem[] = [
      {
        category: "Portfolio",
        equities: allocations.equities,
        bonds: allocations.bonds,
        cash: allocations.cash,
        alternatives: allocations.alternatives,
        columnSettings: {
          fill: am5.color("#2563eb")
        }
      }
    ];

    // Create series for each asset class
    const createSeries = (field: keyof ChartDataItem, name: string, color: string) => {
      if (field === 'category' || field === 'columnSettings') return;
      
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: field,
          categoryXField: "category"
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}: {valueY}%",
        fill: am5.color(color),
        width: am5.percent(50)
      });

      return series;
    };

    createSeries("equities", "Stocks (Equities)", "#2563eb");
    createSeries("bonds", "Bonds (Fixed Income)", "#000000");
    createSeries("cash", "Cash (and Equivalents)", "#22c55e");
    createSeries("alternatives", "Private Alternatives", "#F97316");

    if (unallocated > 0) {
      createSeries("unallocated", "Unallocated", "#64748b");
      data[0].unallocated = unallocated;
    }

    // Set data
    xAxis.data.setAll(data);
    series.data.setAll(data);

    return () => {
      root.dispose();
    };
  }, [allocations]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">My Current Portfolio Mix</h3>
      <div
        id="chartdiv"
        style={{ width: "100%", height: "200px", margin: 0, padding: 0 }}
        className="mt-0"
      />
    </Card>
  );
};