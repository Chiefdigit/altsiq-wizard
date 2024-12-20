import React, { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";
import { formatDollarValue, getSliderColor } from "@/utils/formatters";

interface AllocationSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  portfolioSize: number;
}

export const AllocationSlider = ({
  label,
  value,
  onChange,
  disabled = false,
  portfolioSize,
}: AllocationSliderProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  // Update dollar value whenever portfolio size or percentage changes
  useEffect(() => {
    const dollarValue = (value / 100) * portfolioSize;
    setInputValue(formatDollarValue(dollarValue));
  }, [value, portfolioSize]);

  const handleDollarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue.startsWith('$') ? newValue : `$${newValue}`);
  };

  const handleDollarBlur = () => {
    const numericValue = parseFloat(inputValue.replace(/[$,]/g, ''));
    
    if (!isNaN(numericValue)) {
      // Calculate percentage based on the entered dollar value
      const percentage = Math.round((numericValue / portfolioSize) * 100);
      // Ensure percentage stays within 0-100 range
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      onChange(clampedPercentage);
    }

    // Reset input value to match the current percentage
    const dollarValue = (value / 100) * portfolioSize;
    setInputValue(formatDollarValue(dollarValue));
  };

  const sliderColor = getSliderColor(label);

  return (
    <div className="w-full mb-6">
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
        disabled={disabled}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
          <Slider.Range 
            className="absolute rounded-full h-full" 
            style={{ backgroundColor: sliderColor }}
          />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-lg rounded-full border-2 hover:bg-gray-50 focus:outline-none disabled:opacity-50"
          style={{ borderColor: sliderColor }}
          aria-label={`${label} allocation`}
        />
      </Slider.Root>
      <div className="mt-2">
        <div className="p-2 border rounded-lg text-center">
          <Input
            type="text"
            value={inputValue}
            onChange={handleDollarInputChange}
            onBlur={handleDollarBlur}
            className="text-lg font-medium text-center"
          />
        </div>
      </div>
    </div>
  );
};