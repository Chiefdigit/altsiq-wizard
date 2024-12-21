import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/components/wizard/WizardContext";

export const AlternativesPieChart = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { selectedStrategy } = useWizard();

  useLayoutEffect(() => {
    if (!selectedStrategy) return;

    const root = am5.Root.new("alternatives-chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    chartRef.current = root;

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(40),
        radius: am5.percent(90)
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
      stroke: am5.color(0xffffff),
      templateField: "sliceSettings"
    });

    series.labels.template.setAll({
      text: "{category}: {value}%",
      radius: 30,
      inside: false,
      textType: "adjusted",
      fill: am5.color(0x000000),
      fontSize: 13,
      fontWeight: "400"
    });

    // Create legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        y: am5.percent(102),
        layout: root.horizontalLayout,
        height: am5.percent(10),
        centerY: am5.percent(100),
        background: am5.Rectangle.new(root, {
          fill: am5.color(0xffffff),
          fillOpacity: 0
        })
      })
    );

    legend.labels.template.setAll({
      fontSize: 13,
      fontWeight: "400"
    });

    legend.valueLabels.template.setAll({
      fontSize: 13,
      fontWeight: "400"
    });

    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 0,
      cornerRadiusTR: 0,
      cornerRadiusBL: 0,
      cornerRadiusBR: 0
    });

    // Data matching the image
    const data = [
      {
        category: "One",
        value: 45.45,
        color: am5.color("#69B1FF")
      },
      {
        category: "Two",
        value: 0,
        color: am5.color("#E5E7EB"),
        sliceSettings: { forceHidden: true }
      },
      {
        category: "Three",
        value: 27.27,
        color: am5.color("#818CF8")
      },
      {
        category: "Four",
        value: 22.73,
        color: am5.color("#A78BFA")
      },
      {
        category: "Five",
        value: 0,
        color: am5.color("#E5E7EB"),
        sliceSettings: { forceHidden: true }
      },
      {
        category: "Six",
        value: 0,
        color: am5.color("#E5E7EB"),
        sliceSettings: { forceHidden: true }
      },
      {
        category: "Seven",
        value: 4.55,
        color: am5.color("#E879F9")
      }
    ];

    series.data.setAll(data);
    legend.data.setAll(data);

    return () => {
      root.dispose();
    };
  }, [selectedStrategy]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Distribution Chart</h3>
      <div
        id="alternatives-chartdiv"
        style={{ width: "100%", height: "500px" }}
      />
    </Card>
  );
};