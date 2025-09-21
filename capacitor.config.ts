import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.escalai.app',
  appName: 'Escalei',
  webDir: 'dist',
  server: {
    // url: "http://192.168.164.18:5000", // seu IP + porta do React dev server -- pra testes
    url: "https://escalei-app.vercel.app/", // front host
    cleartext: true
  }
};

export default config;
