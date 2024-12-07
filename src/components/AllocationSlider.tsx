import React from "react";
import * as Slider from "@radix-ui/react-slider";

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
  // Get the color based on the asset type label
  const getSliderColor = (label: string) => {
    switch (label) {
      case "Equities":
        return "#2563eb"; // Primary blue from chart
      case "Bonds":
        return "#64748b"; // Secondary color from chart
      case "Cash":
        return "#22c55e"; // Success color from chart
      case "Alternatives":
        return "#ef4444"; // Red from chart
      default:
        return "#2563eb"; // Default to primary color
    }
  };

  const sliderColor = getSliderColor(label);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-600">{value}%</span>
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
          <span className="text-lg font-medium">
            ${((value / 100) * portfolioSize).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};