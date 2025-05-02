import { useCallback } from 'react';

/**
 * useInputLogger - React hook to log input events for debugging
 * @param label - A label to identify the input in the console
 */
export function useInputLogger(label: string) {
  return useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      console.log(`[Input][${label}]`, {
        name: event.target.name,
        value: event.target.value,
        type: event.target.type,
      });
    },
    [label]
  );
} 