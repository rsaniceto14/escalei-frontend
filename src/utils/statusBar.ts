import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export const initializeStatusBar = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Set status bar to dark content for better safe area detection
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Set background color to transparent for better safe area handling
      await StatusBar.setBackgroundColor({ color: '#00000000' });
      
      // Show the status bar
      await StatusBar.show();
    } catch (error) {
      console.error('Error setting up status bar:', error);
    }
  }
};