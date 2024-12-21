import React, { useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";
import { STRATEGY_DESCRIPTIONS } from "@/constants/strategyDescriptions";

interface AlternativesData {
  category: string;
  value: number;
  color: string;
}

const ALTERNATIVES_COLORS = {
  "Hedge Funds": "#845EC2",
  "Private Equity": "#D65DB1",
  "Private Credit": "#FF6F91",
  "Private Debt": "#FF9671",
  "Real Estate": "#FFC75F",
  "Cryptocurrencies": "#F9F871",
  "Collectibles": "#008F7A",
  "Commodities": "#4B4453"
} as const;

const STRATEGY_ALLOCATIONS = {
  diversification: {
    "Hedge Funds": 20,
    "Private Equity": 15,
    "Private Credit": 15,
    "Private Debt": 10,
    "Real Estate": 15,
    "Cryptocurrencies": 10,
    "Collectibles": 5,
    "Commodities": 10
  },
  income: {
    "Hedge Funds": 15,
    "Private Equity": 10,
    "Private Credit": 25,
    "Private Debt": 20,
    "Real Estate": 20,
    "Cryptocurrencies": 5,
    "Collectibles": 0,
    "Commodities": 5
  },
  growth: {
    "Hedge Funds": 25,
    "Private Equity": 25,
    "Private Credit": 10,
    "Private Debt": 5,
    "Real Estate": 10,
    "Cryptocurrencies": 15,
    "Collectibles": 5,
    "Commodities": 5
  },
  preservation: {
    "Hedge Funds": 20,
    "Private Equity": 10,
    "Private Credit": 20,
    "Private Debt": 15,
    "Real Estate": 25,
    "Cryptocurrencies": 0,
    "Collectibles": 5,
    "Commodities": 5
  },
  advanced: {
    "Hedge Funds": 20,
    "Private Equity": 15,
    "Private Credit": 15,
    "Private Debt": 10,
    "Real Estate": 15,
    "Cryptocurrencies": 10,
    "Collectibles": 5,
    "Commodities": 10
  }
} as const;

export const AlternativesPieChart = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { selectedStrategy } = useWizard();
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(Object.keys(STRATEGY_ALLOCATIONS[selectedStrategy as keyof typeof STRATEGY_ALLOCATIONS]))
  );

  const recalculateAllocations = (categories: Set<string>): AlternativesData[] => {
    const activeCategories = Array.from(categories);
    if (activeCategories.length === 0) return [];

    const currentAllocations = STRATEGY_ALLOCATIONS[selectedStrategy as keyof typeof STRATEGY_ALLOCATIONS];
    const totalActiveAllocation = activeCategories.reduce(
      (sum, category) => sum + currentAllocations[category as keyof typeof currentAllocations], 0
    );

    return activeCategories.map(category => ({
      category,
      value: (currentAllocations[category as keyof typeof currentAllocations] / totalActiveAllocation) * 100,
      color: ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS]
    }));
  };

  useLayoutEffect(() => {
    const root = am5.Root.new("alternatives-chartdiv", {
      useSafeResolution: false
    });
    
    chartRef.current = root;
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
        fillField: "color",
        alignLabels: false
      })
    );

    series.labels.template.setAll({ visible: false });
    series.ticks.template.setAll({ visible: false });

    // Create legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15
      })
    );

    legend.labels.template.setAll({
      fontSize: 13,
      fontWeight: "500"
    });

    legend.valueLabels.template.setAll({ visible: false });
    legend.data.setAll(series.dataItems);

    // Add click listener to toggle categories
    legend.itemContainers.template.states.create("disabled", {
      opacity: 0.5
    });

    legend.itemContainers.template.events.on("click", (e) => {
      const dataItem = e.target.dataItem as am5.DataItem<any>;
      if (!dataItem) return;
      
      const category = dataItem.get("category") as keyof typeof ALTERNATIVES_COLORS;
      if (!category) return;

      const newActiveCategories = new Set(activeCategories);

      if (newActiveCategories.has(category)) {
        if (newActiveCategories.size > 1) { // Prevent removing last category
          newActiveCategories.delete(category);
        }
      } else {
        newActiveCategories.add(category);
      }

      setActiveCategories(newActiveCategories);
      const newData = recalculateAllocations(newActiveCategories);
      series.data.setAll(newData);
    });

    // Set initial data
    const initialData = recalculateAllocations(activeCategories);
    series.data.setAll(initialData);

    return () => {
      root.dispose();
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