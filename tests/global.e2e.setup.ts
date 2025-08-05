import { globalSetup } from './globalSetup';

before(async function () {
  this.timeout(30000);
  const { driver, loginPage } = await globalSetup();
  (global as any).driver = driver;
  (global as any).loginPage = loginPage;
});

after(async function () {
  if ((global as any).driver) {
    await (global as any).driver.quit();
  }
});