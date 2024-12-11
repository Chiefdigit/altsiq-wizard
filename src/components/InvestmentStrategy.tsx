import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect, useRef, useId } from "react";

interface StrategyProps {
  title: string;
  objective: string;
  characteristics: string[];
  allocations: {
    equities: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
  volatility: "VERY LOW" | "LOW - MODERATE" | "MODERATE" | "HIGH";
}

const strategies: StrategyProps[] = [
  {
    title: "Asset Diversification",
    objective: "Spread risk across uncorrelated assets, balancing exposure to traditional asset classes and alternatives.",
    characteristics: [
      "Focused on reducing overall portfolio risk through exposure to uncorrelated assets.",
      "Expecting moderate volatility, willing to accept some risk but avoids large swings.",
      "Seeking steady, risk-adjusted returns that outpace inflation.",
      "Comfortable with a medium to long-term horizon, with moderate liquidity needs.",
      "Prioritizing risk management and balanced exposure over maximizing returns."
    ],
    allocations: {
      equities: 35,
      bonds: 20,
      cash: 5,
      alternatives: 40
    },
    volatility: "MODERATE"
  },
  {
    title: "Income Generation",
    objective: "Maximize income generation through assets that provide regular cash flow.",
    characteristics: [
      "Focused on maximizing regular income through interest, dividends, or rent.",
      "Expecting low to moderate volatility and seeks stability in returns.",
      "Looking for steady income generation with modest capital growth.",
      "Has a medium-term horizon, with a need for liquidity to fund regular expenses.",
      "Income-focused, preferring stable, cash-flow-generating assets over risky investments."
    ],
    allocations: {
      equities: 15,
      bonds: 35,
      cash: 5,
      alternatives: 45
    },
    volatility: "LOW - MODERATE"
  },
  {
    title: "Long-term Growth",
    objective: "Maximize capital appreciation, willing to take on more risk for higher potential returns.",
    characteristics: [
      "Focused on maximizing capital appreciation by investing in high-growth assets.",
      "Expecting high volatility and comfortable with large fluctuations in portfolio value.",
      "Seeking above-average returns, with an emphasis on long-term wealth creation.",
      "Comfortable with a long-term horizon, often in illiquid assets with delayed payouts.",
      "Primarily growth-oriented, willing to take on significant risk for potential future gains."
    ],
    allocations: {
      equities: 50,
      bonds: 10,
      cash: 5,
      alternatives: 35
    },
    volatility: "HIGH"
  },
  {
    title: "Asset Preservation",
    objective: "Preserve capital with low volatility and minimal risk.",
    characteristics: [
      "Focused on preserving capital and minimizing risk, with low volatility expectations.",
      "Expecting very low volatility and values stability and predictability in returns.",
      "Seeking modest returns, mainly to protect against inflation without eroding principal.",
      "Prefers a short to medium-term horizon, with a high demand for liquidity.",
      "Highly conservative, more concerned with avoiding losses than seeking gains."
    ],
    allocations: {
      equities: 10,
      bonds: 50,
      cash: 10,
      alternatives: 30
    },
    volatility: "VERY LOW"
  },
  {
    title: "Custom Allocation",
    objective: "Let's build a personalized allocation for you.",
    characteristics: [],
    allocations: {
      equities: 25,
      bonds: 25,
      cash: 25,
      alternatives: 25
    },
    volatility: "MODERATE"
  }
];

const StrategyCard = ({ strategy }: { strategy: StrategyProps }) => {
  const chartRef = useRef<am5.Root | null>(null);
  const chartId = useId();

  useLayoutEffect(() => {
    if (!chartRef.current) {
      const root = am5.Root.new(`chartdiv-${chartId}`);
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
          alignLabels: false
        })
      );

      series.labels.template.setAll({
        textType: "circular",
        centerX: 0,
        centerY: 0
      });

      series.data.setAll([
        {
          category: "Equities",
          value: strategy.allocations.equities,
          fill: am5.color("#2563eb")
        },
        {
          category: "Bonds",
          value: strategy.allocations.bonds,
          fill: am5.color("#000000")
        },
        {
          category: "Cash",
          value: strategy.allocations.cash,
          fill: am5.color("#22c55e")
        },
        {
          category: "Alternatives",
          value: strategy.allocations.alternatives,
          fill: am5.color("#F97316")
        }
      ]);

      // Add legend
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          y: am5.percent(100),
          layout: root.horizontalLayout
        })
      );

      legend.data.setAll(series.dataItems);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [strategy.allocations, chartId]);

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{strategy.title}</h3>
        <p className="text-gray-600">{strategy.objective}</p>
        
        <div>
          <h4 className="font-medium mb-2">Typically, an investor seeking {strategy.title.toLowerCase()} is:</h4>
          <ul className="space-y-2">
            {strategy.characteristics.map((char, index) => (
              <li key={index} className="text-sm text-gray-600">• {char}</li>
            ))}
          </ul>
        </div>

        <div id={`chartdiv-${chartId}`} style={{ width: "100%", height: "300px" }} />
        
        <div>
          <h4 className="font-medium mb-2">Volatility:</h4>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-32 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full" />
            <span className="text-sm font-medium">{strategy.volatility}</span>
          </div>
        </div>
      </div>
      
      <Button className="w-full md:w-auto">SELECT</Button>
    </Card>
  );
};

export const InvestmentStrategy = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="diversification" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {strategies.map((strategy, index) => (
            <TabsTrigger
              key={index}
              value={strategy.title.toLowerCase().replace(/\s+/g, '-')}
              className={cn(
                "flex-shrink-0",
                index === strategies.length - 1 && "border-l"
              )}
            >
              {strategy.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {strategies.map((strategy, index) => (
          <TabsContent
            key={index}
            value={strategy.title.toLowerCase().replace(/\s+/g, '-')}
          >
            <StrategyCard strategy={strategy} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
