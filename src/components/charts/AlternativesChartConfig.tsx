import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import type { AlternativesData } from "@/utils/chartDataUtils";

export const configureChart = (
  root: am5.Root,
  onCategoryClick: (category: string) => void
) => {
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

  legend.valueLabels.template.setAll({
    visible: true,
    fontSize: 13,
    fontWeight: "500",
    text: "{value}%"
  });

  legend.data.setAll(series.dataItems);

  legend.itemContainers.template.states.create("disabled", {
    opacity: 0.5
  });

  legend.itemContainers.template.events.on("click", (e) => {
    const dataItem = e.target.dataItem as am5.DataItem<any>;
    if (!dataItem) return;
    
    const category = dataItem.get("category");
    if (!category) return;

    onCategoryClick(category);
  });

  return { chart, series };
};