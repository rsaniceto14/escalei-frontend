import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { immediate = false, onSuccess, onError } = options;

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro inesperado';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute
  };
}

// Specialized hook for mutations (create, update, delete)
export function useMutation<T, P = any>(
  mutationFunction: (params: P) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { onSuccess, onError } = options;

  const mutate = async (params: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFunction(params);
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro inesperado';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error
  };
}