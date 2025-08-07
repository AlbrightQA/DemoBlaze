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
  }
};

// Environment-specific overrides
const getEnvironmentOverrides = (): Partial<TestConfig> => {
  const overrides: Partial<TestConfig> = {};
  
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

// Get Chrome options based on headless setting
const getChromeOptions = (headless: boolean): string[] => {
  const baseOptions = ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];
  return headless ? [...baseOptions, '--headless'] : baseOptions;
};

// Merge default config with environment overrides
const mergedConfig = {
  ...defaultConfig,
  ...getEnvironmentOverrides()
};

// Set Chrome options based on headless setting
export const testConfig: TestConfig = {
  ...mergedConfig,
  browser: {
    ...mergedConfig.browser,
    chromeOptions: getChromeOptions(mergedConfig.browser.headless)
  }
};

export default testConfig;
