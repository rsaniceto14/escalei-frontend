import { useEffect } from 'react';
import { pushNotificationService } from '@/services/pushNotificationService';
import { useAuth } from '@/context/AuthContext';

export function usePushNotifications() {
  const { token } = useAuth();

  useEffect(() => {
    // Inicializar push notifications quando o componente montar
    const initPushNotifications = async () => {
      const fcmToken = await pushNotificationService.initialize();
      
      // Se o usuário já estiver logado e temos um token, enviar imediatamente
      if (token && fcmToken) {
        await pushNotificationService.sendTokenToBackend(fcmToken);
      }
    };

    initPushNotifications();
  }, []);

  useEffect(() => {
    // Quando o usuário fizer login, enviar token pendente se existir
    if (token) {
      const pendingToken = localStorage.getItem('pending_fcm_token');
      if (pendingToken) {
        pushNotificationService.sendTokenToBackend(pendingToken);
      }
    }
  }, [token]);
}

