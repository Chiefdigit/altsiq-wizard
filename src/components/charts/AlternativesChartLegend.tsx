import { ALTERNATIVES_COLORS } from "@/constants/alternativesConfig";
import { LegendItem } from "./LegendItem";
import { SlidersHorizontal } from "lucide-react";

interface AlternativesChartLegendProps {
  onAdjustClick: () => void;
  hiddenCategories: Set<string>;
  onToggle: (category: string) => void;
}

export const AlternativesChartLegend = ({
  onAdjustClick,
  hiddenCategories,
  onToggle
}: AlternativesChartLegendProps) => {
  const legendItems = [
    ["Private Equity", "Hedge Funds", "Real Estate", "Cryptocurrencies"],
    ["Private Debt", "Private Credit", "Commodities", "Collectibles"]
  ];

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-medium text-gray-700">Select Asset Classes</h4>
        <button 
          className="text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-2"
          onClick={onAdjustClick}
        >
          <SlidersHorizontal className="h-4 w-4" />
          ADJUST
        </button>
      </div>
      {legendItems.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap gap-4 mb-4 last:mb-0">
          {row.map((category) => (
            <LegendItem
              key={category}
              category={category}
              isVisible={!hiddenCategories.has(category)}
              color={ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS]}
              onToggle={() => onToggle(category)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};