import { test } from '@playwright/test';
import { JSDOM } from "jsdom";

const apiKEY = "LnzaWe0fREchI1JZ"
const serverId = "ui9qxvsg"
const serverDomain = "oslash.mailosaur.net"

test("sample oslash onboarding automation", async ({ page }) => {
  const MailosaurClient = require('mailosaur')
  const mailosaur = new MailosaurClient(apiKEY)
  let name = (Math.random() + 1).toString(36).substring(7);

  const searchCriteria = {
    sentTo: name + "@" + serverDomain
  }
  await page.goto("https://app.oslash.com/login");
  await page.getByPlaceholder("name@email.com").fill(name + "@" + serverDomain);
  await page.getByRole("button", { name: "Send" }).click();
  const message = await mailosaur.messages.get(serverId, searchCriteria)
  const dom = new JSDOM(message.html.body);
  const link = dom.window.document.querySelector('.primary--link').getAttribute("href");
  await page.goto(link)
  await page.getByPlaceholder("Your workspace name").fill("Sample workspace");
  await page.getByPlaceholder("Your company name").fill("Sample company");
  await page.waitForTimeout(1500)
  await page.getByRole("button", { name: "Start 15-day Free Trial" }).click();
  await page.waitForTimeout(2500);
  await page.getByText("skip for now").click();
  await page.getByRole("button", { name: "New Shortcut" }).click();
  await page.getByPlaceholder("shortcut-name").fill("Sample-shortcut");
  await page.getByPlaceholder("Paste the full URL of the page you").fill("https://sanjithkumar.tech");
  await page.getByPlaceholder("Something to describe").fill("Personal Website");
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "sample-shortcut.png", fullPage: true });
});
