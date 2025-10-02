import { useEffect, useState } from 'react';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { Capacitor } from '@capacitor/core';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const useSafeArea = () => {
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSafeArea = async () => {
      if (!Capacitor.isNativePlatform()) {
        setIsLoading(false);
        return;
      }

      try {
        const insets = await SafeArea.getSafeAreaInsets();
        setSafeAreaInsets(insets.insets);
        console.log('Safe area insets loaded:', insets.insets);
        setError(null);
      } catch (err) {
        console.error('Failed to get safe area insets:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to CSS env() variables
        setSafeAreaInsets({ top: 0, bottom: 0, left: 0, right: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    initializeSafeArea();
  }, []);

  const getSafeAreaStyle = (minPadding: number = 0) => ({
    paddingTop: `${Math.max(safeAreaInsets.top, minPadding)}px`,
    paddingBottom: `${Math.max(safeAreaInsets.bottom, minPadding)}px`,
    paddingLeft: `${Math.max(safeAreaInsets.left, minPadding)}px`,
    paddingRight: `${Math.max(safeAreaInsets.right, minPadding)}px`
  });

  return {
    safeAreaInsets,
    isLoading,
    error,
    getSafeAreaStyle,
    isNativePlatform: Capacitor.isNativePlatform()
  };
};
