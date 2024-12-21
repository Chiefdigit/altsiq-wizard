import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";
import { getChartData, getInitialCategories } from "@/utils/chartDataUtils";
import { configureChart } from "./charts/AlternativesChartConfig";

export const AlternativesPieChart = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { selectedStrategy } = useWizard();
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());

  // Effect to update active categories when strategy changes
  useEffect(() => {
    setActiveCategories(getInitialCategories(selectedStrategy));
  }, [selectedStrategy]);

  // Effect to initialize and update chart
  useLayoutEffect(() => {
    // Only create the root once
    if (!chartRef.current) {
      const root = am5.Root.new("alternatives-chartdiv", {
        useSafeResolution: false
      });
      
      chartRef.current = root;
      root.setThemes([am5themes_Animated.new(root)]);

      const { series } = configureChart(root, (category) => {
        setActiveCategories(prev => {
          const newCategories = new Set(prev);
          if (newCategories.has(category)) {
            if (newCategories.size > 1) {
              newCategories.delete(category);
            }
          } else {
            newCategories.add(category);
          }
          return newCategories;
        });
      });

      // Store series reference for updates
      (root as any).customSeries = series;
    }

    // Update data
    const series = (chartRef.current?.container.children.getIndex(0) as any)?.customSeries;
    if (series) {
      const data = getChartData(activeCategories, selectedStrategy);
      series.data.setAll(data);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [activeCategories, selectedStrategy]);

  return (
    <Card className="p-2 md:p-4">
      <h3 className="text-lg font-semibold mb-2 md:mb-4">Alternative Assets Allocation</h3>
      <div
        id="alternatives-chartdiv"
        style={{ width: "100%", height: "400px" }}
      />
    </Card>
  );
};