export interface TestConfig {
  browser: {
    headless: boolean;
    userDataDir: string;
    remoteDebuggingPort: number;
    chromeOptions: string[];
  };
  timeouts: {
    default: number;
    elementWait: number;
    pageLoad: number;
  };
  retries: {
    maxAttempts: number;
    delayBetweenAttempts: number;
  };
}

// Default configuration
const defaultConfig: TestConfig = {
  browser: {
    headless: true, // Default to headless for faster execution
    userDataDir: '/tmp/chrome-user-data',
    remoteDebuggingPort: 9222,
    chromeOptions: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  },
  timeouts: {
    default: 10000,
    elementWait: 5000,
    pageLoad: 30000
  },
  retries: {
    maxAttempts: 3,
    delayBetweenAttempts: 1000
  }
};

// Environment-specific overrides
const getEnvironmentOverrides = (): Partial<TestConfig> => {
  const overrides: Partial<TestConfig> = {};
  
  // CI environment overrides
  if (process.env.CI === 'true') {
    overrides.browser = {
      ...defaultConfig.browser,
      headless: true
    };
  }
  
  // Custom headed setting (for debugging)
  if (process.env.HEADED === 'true') {
    overrides.browser = {
      ...defaultConfig.browser,
      headless: false
    };
  }
  
  // Custom user data directory
  if (process.env.CHROME_USER_DATA_DIR) {
    overrides.browser = {
      ...defaultConfig.browser,
      userDataDir: process.env.CHROME_USER_DATA_DIR
    };
  }
  
  return overrides;
};

// Merge default config with environment overrides
export const testConfig: TestConfig = {
  ...defaultConfig,
  ...getEnvironmentOverrides()
};

export default testConfig;
