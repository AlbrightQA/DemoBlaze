import { WebDriver } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';

export interface DebugInfo {
  screenshotPath: string;
  pageSourcePath: string;
  timestamp: string;
}

export async function takeDebugScreenshot(driver: WebDriver, testName: string): Promise<DebugInfo> {
  console.log('Taking debug screenshot...');
  
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeTestName = testName.replace(/[^a-zA-Z0-9]/g, '-');
  
  // Take screenshot
  const screenshot = await driver.takeScreenshot();
  const screenshotPath = path.join(screenshotsDir, `${safeTestName}-${timestamp}.png`);
  fs.writeFileSync(screenshotPath, screenshot, 'base64');
  console.log(`Screenshot saved: ${screenshotPath}`);
  
  // Get page source
  const pageSource = await driver.getPageSource();
  const pageSourcePath = path.join(screenshotsDir, `${safeTestName}-${timestamp}.html`);
  fs.writeFileSync(pageSourcePath, pageSource);
  console.log(`Page source saved: ${pageSourcePath}`);
  
  return {
    screenshotPath,
    pageSourcePath,
    timestamp
  };
}

export async function debugElementState(driver: WebDriver, selector: string, description: string): Promise<void> {
  console.log(`Debugging element: ${description} (${selector})`);
  
  try {
    const elements = await driver.findElements(driver.By.css(selector));
    console.log(`Found ${elements.length} elements matching "${selector}"`);
    
    if (elements.length > 0) {
      const text = await elements[0].getText();
      console.log(`Element text: "${text}"`);
    }
  } catch (error) {
    console.log(`Error finding element "${selector}":`, error instanceof Error ? error.message : String(error));
  }
}

export async function debugPageState(driver: WebDriver, testName: string, error?: Error): Promise<DebugInfo> {
  console.log('❌ Test failed. Taking debug screenshot...');
  
  const debugInfo = await takeDebugScreenshot(driver, testName);
  
  // Log current URL
  const currentUrl = await driver.getCurrentUrl();
  console.log(`Current URL: ${currentUrl}`);
  
  // Log page title
  const pageTitle = await driver.getTitle();
  console.log(`Page title: "${pageTitle}"`);
  
  if (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  return debugInfo;
}
