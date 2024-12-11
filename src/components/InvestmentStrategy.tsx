import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { StrategyCard } from "./strategy/StrategyCard";
import { strategies } from "./strategy/types";

export const InvestmentStrategy = () => {
  return (
    <Tabs defaultValue="diversification" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        {strategies.map((strategy, index) => (
          <TabsTrigger
            key={index}
            value={strategy.title.toLowerCase().replace(/\s+/g, '-')}
            className={cn(
              "flex-shrink-0",
              index === strategies.length - 1 && "border-l"
            )}
          >
            {strategy.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {strategies.map((strategy, index) => (
        <TabsContent
          key={index}
          value={strategy.title.toLowerCase().replace(/\s+/g, '-')}
        >
          <StrategyCard strategy={strategy} />
        </TabsContent>
      ))}
    </Tabs>
  );
};