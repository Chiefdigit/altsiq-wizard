import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

export const configureChart = (root: am5.Root) => {
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

  // Remove external labels
  series.labels.template.set("visible", false);
  series.ticks.template.set("visible", false);

  // Configure tooltips
  series.slices.template.setAll({
    tooltipText: "{category}: {value}%"
  });

  return { chart, series };
};