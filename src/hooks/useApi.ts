import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(
  apiFunction: () => Promise<ApiSuccessResponse<T>>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { toast } = useToast();

  const { immediate = false, onSuccess, onError } = options;

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      
      if (result.success) {
        setData(result.data);
        onSuccess?.(result.data);
        return result.data;
      } else {
        throw result;
      }
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      onError?.(apiError);
      throw apiError;
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
  mutationFunction: (params: P) => Promise<ApiSuccessResponse<T>>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { toast } = useToast();

  const { onSuccess, onError } = options;

  const mutate = async (params: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFunction(params);
      
      if (result.success) {
        setData(result.data);
        onSuccess?.(result.data);
        return result.data;
      } else {
        throw result;
      }
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      onError?.(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    mutate
  };
}