import { cn } from "@/lib/utils";

interface LegendItemProps {
  category: string;
  isVisible: boolean;
  colorClass: string;
  onToggle: () => void;
}

export const LegendItem = ({ category, isVisible, colorClass, onToggle }: LegendItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onToggle}
      >
        <div 
          className={cn(
            "w-4 h-4 rounded transition-colors",
            colorClass,
            !isVisible && "opacity-40"
          )} 
        />
        <span 
          className={cn(
            "text-sm transition-colors",
            isVisible ? "text-gray-900" : "text-gray-400"
          )}
        >
          {category}
        </span>
      </div>
    </div>
  );
};