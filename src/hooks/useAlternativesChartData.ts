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

        // Add a small delay to ensure localStorage is updated
        await new Promise(resolve => setTimeout(resolve, 100));

        if (currentStrategy === 'advanced') {
          const savedAllocations = localStorage.getItem('alternativesAllocations');
          if (savedAllocations) {
            const parsedAllocations = JSON.parse(savedAllocations);
            console.log('Loaded advanced allocations:', parsedAllocations);
            setCustomAllocations(parsedAllocations);
          }
        } else {
          const strategyAllocations = STRATEGY_ALLOCATIONS[currentStrategy as keyof typeof STRATEGY_ALLOCATIONS];
          if (strategyAllocations) {
            console.log(`Loading strategy allocations for: ${currentStrategy}`, strategyAllocations);
            setCustomAllocations(strategyAllocations);
          } else {
            throw new Error(`Invalid strategy: ${currentStrategy}`);
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