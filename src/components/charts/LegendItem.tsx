import { cn } from "@/lib/utils";

interface LegendItemProps {
  category: string;
  isVisible: boolean;
  color: string;
  onToggle: () => void;
}

export const LegendItem = ({ category, isVisible, color, onToggle }: LegendItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onToggle}
      >
        <div 
          className={cn(
            "w-3 h-3 rounded-full",
            !isVisible && "opacity-40"
          )}
          style={{ backgroundColor: color }}
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