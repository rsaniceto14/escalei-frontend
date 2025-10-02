import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.escalei.app',
  appName: 'Escalei',
  webDir: 'dist',
  server: {
    // url: "http://192.168.164.18:5000", // seu IP + porta do React dev server -- pra testes
    url: "https://escalei-app.vercel.app/", // front host
    cleartext: true
  },
  plugins: {
    SafeArea: {
      enabled: true
    }
  }
};

export default config;
