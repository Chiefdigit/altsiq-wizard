import { useState, useEffect } from 'react';
import { STRATEGY_ALLOCATIONS } from '@/constants/alternativesConfig';

export const useAlternativesChartData = (currentStrategy: string) => {
  const [customAllocations, setCustomAllocations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllocations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!currentStrategy) {
          console.log('No current strategy, skipping allocation load');
          return;
        }

        console.log('Loading allocations for strategy:', currentStrategy);

        // For non-advanced strategies, always use the predefined allocations
        if (currentStrategy !== 'advanced') {
          const strategyKey = currentStrategy as keyof typeof STRATEGY_ALLOCATIONS;
          const strategyAllocations = STRATEGY_ALLOCATIONS[strategyKey];
          
          if (strategyAllocations) {
            console.log(`Setting predefined allocations for ${currentStrategy}:`, strategyAllocations);
            setCustomAllocations(strategyAllocations);
            localStorage.setItem('alternativesAllocations', JSON.stringify(strategyAllocations));
          } else {
            throw new Error(`Invalid strategy: ${currentStrategy}`);
          }
        } else {
          // For advanced strategy, use saved custom allocations
          const savedAllocations = localStorage.getItem('alternativesAllocations');
          if (savedAllocations) {
            const parsedAllocations = JSON.parse(savedAllocations);
            console.log('Loading saved advanced allocations:', parsedAllocations);
            setCustomAllocations(parsedAllocations);
          }
        }
      } catch (err) {
        console.error('Error loading allocations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load allocations');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllocations();
  }, [currentStrategy]);

  return { customAllocations, isLoading, error };
};