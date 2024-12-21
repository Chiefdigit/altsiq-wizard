import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";
import { getChartData, getInitialCategories } from "@/utils/chartDataUtils";

export const AlternativesPieChart = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { selectedStrategy } = useWizard();
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());

  // Effect to update active categories when strategy changes
  useEffect(() => {
    if (selectedStrategy) {
      setActiveCategories(getInitialCategories(selectedStrategy));
    }
  }, [selectedStrategy]);

  // Effect to initialize and update chart
  useLayoutEffect(() => {
    if (!selectedStrategy) return;

    // Create root if it doesn't exist
    if (!chartRef.current) {
      const root = am5.Root.new("alternatives-chartdiv");
      root.setThemes([am5themes_Animated.new(root)]);
      chartRef.current = root;

      // Create chart
      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
          innerRadius: am5.percent(50)
        })
      );

      // Create series
      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
          fillField: "color"
        })
      );

      // Configure series
      series.slices.template.setAll({
        strokeWidth: 2,
        stroke: am5.color(0xffffff)
      });

      series.labels.template.setAll({
        text: "{category}: {value}%",
        textType: "circular",
        inside: true,
        radius: 10
      });

      // Create legend
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          marginTop: 15,
          marginBottom: 15
        })
      );

      legend.data.setAll([]);
      series.data.setAll([]);

      // Store references
      (root as any).series = series;
      (root as any).legend = legend;
    }

    // Update data
    const root = chartRef.current;
    if (root) {
      const series = (root as any).series;
      const legend = (root as any).legend;
      if (series && legend) {
        const data = getChartData(activeCategories, selectedStrategy);
        console.log('Chart data:', data); // Debug log
        series.data.setAll(data);
        legend.data.setAll(data);
      }
    }

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [activeCategories, selectedStrategy]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Alternative Assets Allocation</h3>
      <div
        id="alternatives-chartdiv"
        style={{ width: "100%", height: "400px", minHeight: "400px" }}
      />
    </Card>
  );
};