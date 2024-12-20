import React, { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";
import { formatDollarValue } from "@/utils/formatters";
import { getSliderColor } from "@/utils/formatters";

interface PortfolioSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  portfolioSize: number;
}

export const AllocationSlider = ({ 
  label, 
  value, 
  onChange,
  portfolioSize 
}: PortfolioSliderProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Update dollar value whenever portfolio size or percentage changes
    const dollarValue = (value / 100) * portfolioSize;
    console.log(`Calculating dollar value for ${label}:`, { value, portfolioSize, dollarValue });
    setInputValue(formatDollarValue(dollarValue));
  }, [value, portfolioSize, label]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue.startsWith('$') ? newValue : `$${newValue}`);
  };

  const handleBlur = () => {
    const numericValue = parseFloat(inputValue.replace(/[$,]/g, ''));
    
    if (!isNaN(numericValue)) {
      // Calculate percentage based on the entered dollar value and current portfolio size
      const percentage = Math.round((numericValue / portfolioSize) * 100);
      // Ensure percentage stays within 0-100 range
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      onChange(clampedPercentage);
    }

    // Reset input value to match the current percentage of the current portfolio size
    const dollarValue = (value / 100) * portfolioSize;
    setInputValue(formatDollarValue(dollarValue));
  };

  const sliderColor = getSliderColor(label);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <div className="w-20">
          <Input
            type="text"
            value={value + "%"}
            className="h-7 text-right text-sm"
            disabled={true}
            readOnly
          />
        </div>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={100}
        min={0}
        step={1}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
          <Slider.Range className={`absolute rounded-full h-full`} style={{ backgroundColor: sliderColor }} />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-lg rounded-full border-2 hover:bg-gray-50 focus:outline-none"
          style={{ borderColor: sliderColor }}
          aria-label={`${label} allocation`}
        />
      </Slider.Root>
      <div className="mt-2">
        <div className="p-2 border rounded-lg text-center">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="text-lg font-medium text-center"
          />
        </div>
      </div>
    </div>
  );
};