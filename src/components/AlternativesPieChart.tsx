import React, { useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";

export const AlternativesPieChart = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { selectedStrategy } = useWizard();
  const [showPrivate, setShowPrivate] = useState(true);
  const [showPublic, setShowPublic] = useState(true);

  useLayoutEffect(() => {
    if (!selectedStrategy) return;

    const root = am5.Root.new("alternatives-chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    chartRef.current = root;

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
        paddingBottom: 50
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

    series.slices.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(0xffffff)
    });

    series.labels.template.setAll({
      text: "{category}: {value}%",
      textType: "adjusted",
      radius: 10,
      inside: true,
      fill: am5.color(0xffffff),
      fontSize: 13
    });

    // Create legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: root.horizontalLayout,
        height: 50,
        marginTop: 20
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

    legend.data.setAll([
      { 
        name: "Private Markets",
        value: showPrivate,
        toggleDataItem: true,
        click: () => {
          setShowPrivate(!showPrivate);
        }
      },
      {
        name: "Public Markets",
        value: showPublic,
        toggleDataItem: true,
        click: () => {
          setShowPublic(!showPublic);
        }
      }
    ]);

    const updateData = () => {
      const data = [];
      
      if (showPrivate) {
        data.push(
          {
            category: "Private Equity",
            value: 30,
            color: am5.color("#845EC2")
          },
          {
            category: "Private Credit",
            value: 20,
            color: am5.color("#D65DB1")
          }
        );
      }
      
      if (showPublic) {
        data.push(
          {
            category: "Public Equity",
            value: 35,
            color: am5.color("#FF6F91")
          },
          {
            category: "Public Debt",
            value: 15,
            color: am5.color("#FF9671")
          }
        );
      }

      series.data.setAll(data);
    };

    updateData();

    root.events.on("frameended", () => {
      updateData();
    });

    return () => {
      root.dispose();
    };
  }, [selectedStrategy, showPrivate, showPublic]);

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