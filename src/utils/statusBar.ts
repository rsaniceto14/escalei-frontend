import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export const initializeStatusBar = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Set status bar to light content (white text on dark background)
      await StatusBar.setStyle({ style: Style.Light });
      
      // Set background color to match your app's primary color
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      
      // Show the status bar
      await StatusBar.show();
    } catch (error) {
      console.error('Error setting up status bar:', error);
    }
  }
};