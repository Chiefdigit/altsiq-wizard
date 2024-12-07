import React, { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";

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

  useEffect(() => {
    if (!inputValue) {
      setInputValue(`$${((value / 100) * portfolioSize).toLocaleString()}`);
    }
  }, [value, portfolioSize]);

  const getSliderColor = (label: string) => {
    switch (label) {
      case "Equities":
        return "#2563eb";
      case "Bonds":
        return "#000000";
      case "Cash":
        return "#22c55e";
      case "Alternatives":
        return "#F97316";
      default:
        return "#2563eb";
    }
  };

  const handleDollarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // If the input starts with $, remove it before setting
    setInputValue(newValue.startsWith('$') ? newValue : `$${newValue}`);
  };

  const handleDollarBlur = () => {
    // Remove $ and commas, then parse
    const numericValue = inputValue.replace(/[$,]/g, '');
    
    if (numericValue && !isNaN(Number(numericValue))) {
      const parsedValue = parseInt(numericValue, 10);
      const percentage = Math.round((parsedValue / portfolioSize) * 100);
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      onChange(clampedPercentage);
      setInputValue(`$${parsedValue.toLocaleString()}`);
    } else {
      // Reset to current value if invalid input
      setInputValue(`$${((value / 100) * portfolioSize).toLocaleString()}`);
    }
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