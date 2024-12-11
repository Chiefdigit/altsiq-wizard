import React from 'react';

interface StrategyLegendProps {
  allocation: {
    equities: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
}

export const StrategyLegend = ({ allocation }: StrategyLegendProps) => {
  const items = [
    { label: 'Stocks (Equities)', value: allocation.equities, color: '#2563eb' },
    { label: 'Bonds (Fixed Income)', value: allocation.bonds, color: '#000000' },
    { label: 'Cash (and Equivalents)', value: allocation.cash, color: '#22c55e' },
    { label: 'Private Alternatives', value: allocation.alternatives, color: '#F97316' },
  ];

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-600">
            {item.label}: {item.value}%
          </span>
        </div>
      ))}
    </div>
  );
};