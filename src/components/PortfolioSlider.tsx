import React, { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";

interface PortfolioSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const PortfolioSlider = ({ value, onChange }: PortfolioSliderProps) => {
  const [inputValue, setInputValue] = useState(value.toLocaleString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    
    // Remove all non-numeric characters except commas
    const numericValue = rawValue.replace(/[^0-9,]/g, '').replace(/,/g, '');
    
    if (numericValue) {
      const parsedValue = parseInt(numericValue, 10);
      if (!isNaN(parsedValue)) {
        // Always update the slider within valid range
        const clampedValue = Math.max(50000, Math.min(5000000, parsedValue));
        onChange(clampedValue);
      }
    }
  };

  // Update input value when slider changes
  React.useEffect(() => {
    setInputValue(value.toLocaleString());
  }, [value]);

  const handleBlur = () => {
    // On blur, format the value properly and ensure it's within bounds
    const numericValue = inputValue.replace(/[^0-9,]/g, '').replace(/,/g, '');
    const parsedValue = parseInt(numericValue, 10);
    
    if (isNaN(parsedValue) || parsedValue < 50000) {
      onChange(50000);
    } else if (parsedValue > 5000000) {
      onChange(5000000);
    } else {
      onChange(parsedValue);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">$50k</span>
        <span className="text-sm text-gray-600">$5M</span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={5000000}
        min={50000}
        step={10000}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
          <Slider.Range className="absolute bg-[#2563eb] rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-lg rounded-full border-2 border-[#2563eb] hover:bg-gray-50 focus:outline-none"
          aria-label="Portfolio size"
        />
      </Slider.Root>
      <div className="mt-4">
        <div className="p-3 border rounded-lg">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="text-xl font-semibold text-center"
            aria-label="Portfolio size input"
          />
        </div>
      </div>
    </div>
  );
};