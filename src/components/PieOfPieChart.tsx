import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";

export const PieOfPieChart = ({ mainAllocation, alternativesBreakdown = {
  privateEquity: 25,
  realEstate: 25,
  hedge: 25,
  venture: 25
}}) => {
  const chartRef = useRef(null);
  const chartId = React.useId();

  useLayoutEffect(() => {
    const root = am5.Root.new(`chartdiv-${chartId}`);
    
    chartRef.current = root;
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.horizontalLayout,
        innerRadius: am5.percent(40)
      })
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "value",
        categoryField: "category",
        radius: am5.percent(80),
        tooltip: am5.Tooltip.new(root, {
          labelText: "{category}: {value}%"
        })
      })
    );

    // Set up data
    const data = [
      {
        category: "Stocks (Equities)",
        value: mainAllocation.equities,
        settings: { fill: am5.color("#2563eb") }
      },
      {
        category: "Bonds (Fixed Income)",
        value: mainAllocation.bonds,
        settings: { fill: am5.color("#000000") }
      },
      {
        category: "Cash (and Equivalents)",
        value: mainAllocation.cash,
        settings: { fill: am5.color("#22c55e") }
      }
    ];

    // Add alternatives data with children
    const alternativesData = {
      category: "Private Alternatives",
      value: mainAllocation.alternatives,
      settings: { fill: am5.color("#F97316") },
      children: [
        {
          category: "Private Equity",
          value: (alternativesBreakdown.privateEquity * mainAllocation.alternatives) / 100,
          settings: { fill: am5.color("#FB923C") }
        },
        {
          category: "Real Estate",
          value: (alternativesBreakdown.realEstate * mainAllocation.alternatives) / 100,
          settings: { fill: am5.color("#FDBA74") }
        },
        {
          category: "Hedge Funds",
          value: (alternativesBreakdown.hedge * mainAllocation.alternatives) / 100,
          settings: { fill: am5.color("#FED7AA") }
        },
        {
          category: "Venture Capital",
          value: (alternativesBreakdown.venture * mainAllocation.alternatives) / 100,
          settings: { fill: am5.color("#FFEDD5") }
        }
      ]
    };

    data.push(alternativesData);

    // Configure series
    series.slices.template.setAll({
      templateField: "settings",
      strokeWidth: 2,
      stroke: am5.color(0xffffff),
      toggleKey: "active",
      cornerRadius: 5
    });

    let isShowingAlternatives = false;

    // Add click listener
    series.slices.template.events.on("click", (ev) => {
      const slice = ev.target;
      const dataItem = slice.dataItem;
      
      if (dataItem.dataContext["children"] && !isShowingAlternatives) {
        // Show alternatives breakdown
        series.data.setAll(dataItem.dataContext["children"]);
        chartTitle.set("text", "Alternatives Breakdown (Click any slice to return)");
        isShowingAlternatives = true;
      } else if (isShowingAlternatives) {
        // Return to main view
        series.data.setAll(data);
        chartTitle.set("text", "Portfolio Allocation");
        isShowingAlternatives = false;
      }
    });

    // Create legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: root.verticalLayout
      })
    );

    // Add chart title
    const chartTitle = chart.children.unshift(
      am5.Label.new(root, {
        text: "Portfolio Allocation",
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 20
      })
    );

    legend.data.setAll(series.dataItems);

    // Set data
    series.data.setAll(data);

    // Animate chart
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [mainAllocation, alternativesBreakdown, chartId]);

  return (
    <Card className="p-4">
      <div
        id={`chartdiv-${chartId}`}
        style={{ width: "100%", height: "400px" }}
      />
    </Card>
  );
};