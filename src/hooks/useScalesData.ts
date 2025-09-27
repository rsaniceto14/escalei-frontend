import { useApi } from './useApi';
import { scaleService} from '@/api';

export function useScalesData() {
  const {
    data: confirmedScales,
    loading: loadingConfirmed,
    error: errorConfirmed,
    refetch: refetchConfirmed,
  } = useApi(async () => ({ success: true as const, data: await scaleService.getConfirmedScales() }), {
    immediate: true,
  });

  const {
    data: pendingScales,
    loading: loadingPending,
    error: errorPending,
    refetch: refetchPending,
  } = useApi(async () => ({ success: true as const, data: await scaleService.getPendingScales() }), {
    immediate: true,
  });

  return {
    escalasParticipa: confirmedScales || [],
    escalasPendentes: pendingScales || [],
    loading: loadingConfirmed || loadingPending,
    error: errorConfirmed || errorPending,
    refetch: () => {
      refetchConfirmed();
      refetchPending();
    },
  };
}
