import { Card } from "@/components/ui/card";

export const ChartLoadingSpinner = () => {
  return (
    <Card className="p-4">
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </Card>
  );
};