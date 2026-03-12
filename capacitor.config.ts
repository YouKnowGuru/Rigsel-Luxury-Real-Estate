import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.phojaarealestate.app',
  appName: 'Phojaa Real Estate',
  webDir: 'public',
  server: {
    url: 'http://phojaarealestate.com',
    cleartext: true
  }
};

export default config;
