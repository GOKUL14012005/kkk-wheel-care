/**
 * Capacitor Mobile Configuration
 * Satisfies Requirement 10: Mobile extension readiness for Android & iOS wrapper
 */

export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime?: boolean;
  server?: {
    androidScheme?: string;
    cleartext?: boolean;
    url?: string;
  };
}

const config: CapacitorConfig = {
  appId: 'com.kkkwheelcare.app',
  appName: 'KKK Wheel Care',
  webDir: 'dist/frontend/browser',
  server: {
    androidScheme: 'https',
    cleartext: false
  }
};

export default config;
