import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.echurch.app',
  appName: 'E_Church',
  webDir: 'dist',
  server: {
    url: "http://192.168.164.18:5000", // seu IP + porta do React dev server
    cleartext: true
  }
};

export default config;
