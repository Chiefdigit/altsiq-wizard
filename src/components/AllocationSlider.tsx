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
  const [dollarValue, setDollarValue] = useState(((value / 100) * portfolioSize).toLocaleString());

  useEffect(() => {
    setDollarValue(((value / 100) * portfolioSize).toLocaleString());
  }, [value, portfolioSize]);

  const getSliderColor = (label: string) => {
    switch (label) {
      case "Equities":
        return "#2563eb";
      case "Bonds":
        return "#64748b";
      case "Cash":
        return "#22c55e";
      case "Alternatives":
        return "#ef4444";
      default:
        return "#2563eb";
    }
  };

  const handleDollarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Remove dollar sign and any other non-numeric characters except commas
    const cleanValue = rawValue.replace(/[$,]/g, '');
    
    if (cleanValue) {
      const parsedValue = parseInt(cleanValue, 10);
      if (!isNaN(parsedValue)) {
        setDollarValue(parsedValue.toLocaleString());
        // Convert dollar value to percentage
        const percentage = Math.round((parsedValue / portfolioSize) * 100);
        // Clamp percentage between 0 and 100
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        onChange(clampedPercentage);
      }
    } else {
      setDollarValue('0');
      onChange(0);
    }
  };

  const handleDollarBlur = () => {
    // On blur, format the value properly
    setDollarValue(((value / 100) * portfolioSize).toLocaleString());
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
            value={`$${dollarValue}`}
            onChange={handleDollarInputChange}
            onBlur={handleDollarBlur}
            className="text-lg font-medium text-center"
          />
        </div>
      </div>
    </div>
  );
};