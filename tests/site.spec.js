// @ts-check
const { test, expect } = require("@playwright/test");

test("has the sections the navigation links to", async ({ page }) => {
  await page.goto("/");
  for (const id of ["como", "perguntas", "privacidade"]) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
});

test("does not scroll horizontally on a 375 px phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test("shows the hero and the brand notice", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pergunte às suas fotos.");
  await expect(page.locator("footer")).toContainText("Nome e logótipo Sepiabox: todos os direitos reservados");
});
