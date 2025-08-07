import { WebDriver } from 'selenium-webdriver';

export interface SessionInfo {
  tokenCookie: string;
  userCookie: string;
}

export async function getBrowserSession(driver: WebDriver): Promise<SessionInfo> {
  const cookies = await driver.manage().getCookies();

  const tokenCookie = cookies.find((cookie: any) => cookie.name === 'tokenp_');
  const userCookie = cookies.find((cookie: any) => cookie.name === 'user');

  if (!tokenCookie) {
    throw new Error('tokenp_ cookie not found in browser session');
  }

  if (!userCookie) {
    throw new Error('user cookie not found in browser session');
  }

  return {
    tokenCookie: tokenCookie.value,
    userCookie: userCookie.value,
  };
}
