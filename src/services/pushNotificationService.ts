import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { apiClient } from '@/api/config';
import { ApiResponse } from '@/api/types';

class PushNotificationService {
  private fcmToken: string | null = null;

  /**
   * Inicializa e solicita permissões para push notifications
   */
  async initialize(): Promise<string | null> {
    // Apenas em dispositivos nativos (não web)
    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications only work on native platforms');
      return null;
    }

    try {
      // Solicitar permissão
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('User denied push notification permission');
        return null;
      }

      // Registrar para receber notificações
      await PushNotifications.register();

      // Configurar listeners
      this.setupListeners();

      return this.fcmToken;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return null;
    }
  }

  /**
   * Configura listeners para eventos de push notifications
   */
  private setupListeners(): void {
    // Token recebido
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      this.fcmToken = token.value;
      
      // Enviar token para o backend se o usuário estiver logado
      this.sendTokenToBackend(token.value);
    });

    // Erro no registro
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Notificação recebida quando app está em foreground
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
      // Aqui você pode mostrar uma notificação local ou atualizar o estado
    });

    // Notificação clicada
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
      // Navegar para a tela relevante baseado nos dados da notificação
    });
  }

  /**
   * Envia o FCM token para o backend
   */
  async sendTokenToBackend(token: string): Promise<void> {
    try {
      const storedToken = localStorage.getItem('jwt');
      if (!storedToken) {
        // Usuário não está logado, salvar token para enviar depois do login
        localStorage.setItem('pending_fcm_token', token);
        return;
      }

      // Enviar token para o backend
      await apiClient.post<ApiResponse<void>>('/v1/users/fcm-token', {
        fcm_token: token,
      });

      // Remover token pendente se existir
      localStorage.removeItem('pending_fcm_token');
      console.log('FCM token sent to backend successfully');
    } catch (error) {
      console.error('Error sending FCM token to backend:', error);
      // Salvar como pendente para tentar novamente depois
      localStorage.setItem('pending_fcm_token', token);
    }
  }

  /**
   * Obtém o token FCM atual
   */
  getToken(): string | null {
    return this.fcmToken;
  }

  /**
   * Limpa o token (no logout)
   */
  clearToken(): void {
    this.fcmToken = null;
    localStorage.removeItem('pending_fcm_token');
  }
}

export const pushNotificationService = new PushNotificationService();

