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

  useEffect(() => {
    if (selectedStrategy) {
      setActiveCategories(getInitialCategories(selectedStrategy));
    }
  }, [selectedStrategy]);

  useLayoutEffect(() => {
    if (!selectedStrategy) return;

    if (!chartRef.current) {
      const root = am5.Root.new("alternatives-chartdiv");
      root.setThemes([am5themes_Animated.new(root)]);
      chartRef.current = root;

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
          fillField: "color"
        })
      );

      series.slices.template.setAll({
        strokeWidth: 2,
        stroke: am5.color(0xffffff)
      });

      series.labels.template.setAll({
        text: "{category}: {value.formatNumber('#.0')}%",
        radius: 10,
        inside: true,
        textType: "adjusted",
        fill: am5.color(0xffffff)
      });

      // Configure legend at the bottom
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          marginTop: 30,
          marginBottom: 15,
          layout: root.horizontalLayout,
          height: 50,
          width: am5.percent(90),
          verticalScrollbar: am5.Scrollbar.new(root, {
            orientation: "vertical"
          })
        })
      );

      legend.labels.template.setAll({
        fontSize: 13,
        fontWeight: "500"
      });

      legend.valueLabels.template.setAll({
        fontSize: 13,
        fontWeight: "500"
      });

      legend.itemContainers.template.states.create("disabled", {
        opacity: 0.5
      });

      legend.itemContainers.template.events.on("click", (e) => {
        const dataItem = e.target.dataItem as am5.DataItem<any>;
        if (!dataItem) return;
        
        const category = dataItem.get("category");
        if (!category) return;

        const newActiveCategories = new Set(activeCategories);
        if (newActiveCategories.has(category)) {
          newActiveCategories.delete(category);
        } else {
          newActiveCategories.add(category);
        }
        setActiveCategories(newActiveCategories);
      });

      (root as any).series = series;
      (root as any).legend = legend;
    }

    const root = chartRef.current;
    if (root) {
      const series = (root as any).series;
      const legend = (root as any).legend;
      if (series && legend) {
        const data = getChartData(activeCategories, selectedStrategy);
        console.log('Chart data with adjusted percentages:', data);
        series.data.setAll(data);
        legend.data.setAll(data);
      }
    }

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
        style={{ width: "100%", height: "500px" }}
      />
    </Card>
  );
};