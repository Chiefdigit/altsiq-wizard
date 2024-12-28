import React, { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";
import { formatDollarValue } from "@/utils/formatters";
import { getSliderColor } from "@/utils/formatters";
import { toast } from "@/components/ui/use-toast";

interface PortfolioSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  portfolioSize: number;
  totalAllocation: number;  // Add this prop
}

export const AllocationSlider = ({ 
  label, 
  value, 
  onChange,
  portfolioSize,
  totalAllocation 
}: PortfolioSliderProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const dollarValue = (value / 100) * portfolioSize;
    setInputValue(formatDollarValue(dollarValue));
  }, [value, portfolioSize, label]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue.startsWith('$') ? newValue : `$${newValue}`);
  };

  const handleBlur = () => {
    const numericValue = parseFloat(inputValue.replace(/[$,]/g, ''));
    
    if (!isNaN(numericValue)) {
      const percentage = Math.round((numericValue / portfolioSize) * 100);
      const otherAllocations = totalAllocation - value;
      const maxAllowed = 100 - otherAllocations;
      const clampedPercentage = Math.max(0, Math.min(maxAllowed, percentage));
      
      if (clampedPercentage !== percentage) {
        toast({
          title: "Allocation Adjusted",
          description: `Maximum allowed allocation is ${maxAllowed}%`,
          variant: "destructive",
        });
      }
      
      onChange(clampedPercentage);
    }

    const dollarValue = (value / 100) * portfolioSize;
    setInputValue(formatDollarValue(dollarValue));
  };

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    const otherAllocations = totalAllocation - value;
    const maxAllowed = 100 - otherAllocations;
    
    if (newValue > maxAllowed) {
      toast({
        title: "Maximum Allocation Reached",
        description: `Cannot exceed ${maxAllowed}% for this asset class`,
        variant: "destructive",
      });
      onChange(maxAllowed);
      return;
    }
    
    onChange(newValue);
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
        onValueChange={handleSliderChange}
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