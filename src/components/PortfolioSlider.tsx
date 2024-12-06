import React from "react";
import * as Slider from "@radix-ui/react-slider";

interface PortfolioSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const PortfolioSlider = ({ value, onChange }: PortfolioSliderProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">$250k</span>
        <span className="text-sm text-gray-600">$10M</span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={10000000}
        min={250000}
        step={10000}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
          <Slider.Range className="absolute bg-primary rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-lg rounded-full border-2 border-primary hover:bg-gray-50 focus:outline-none"
          aria-label="Portfolio size"
        />
      </Slider.Root>
      <div className="mt-4">
        <div className="p-3 border rounded-lg text-center">
          <span className="text-xl font-semibold">${value.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};